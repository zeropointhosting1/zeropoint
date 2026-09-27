import { getSupabaseClient } from "@/lib/supabase/client"

export type ChatSender = "visitor" | "admin"

export type ChatMessageRow = {
  id: string
  conversation_id: string
  sender: ChatSender
  body: string
  created_at: string
}

export type ChatConversation = {
  id: string
  visitor_id: string
  visitor_name: string | null
  status: "open" | "closed"
  created_at: string
  last_message_at: string
}

// The site is a static export with no visitor login — an anonymous
// Supabase Auth session is what gives RLS a stable auth.uid() to scope a
// conversation to "whoever started it" (see chat_conversations_visitor in
// supabase/migrations/0001_admin.sql). Supabase persists the session in
// localStorage, so a visitor keeps the same identity across reloads on
// the same browser without ever seeing a login screen.
async function ensureVisitorSession() {
  const supabase = getSupabaseClient()
  const { data } = await supabase.auth.getSession()
  if (data.session) return data.session
  const { data: signedIn, error } = await supabase.auth.signInAnonymously()
  if (error || !signedIn.session) throw error ?? new Error("Anonymous sign-in failed")
  return signedIn.session
}

const CONVERSATION_KEY = "zp-chat-conversation-id"

// One open conversation per browser: reuses the id in localStorage as long
// as the row is still readable (still belongs to this visitor and hasn't
// been reassigned) — falls back to creating a new one otherwise.
export async function getOrCreateConversation(): Promise<ChatConversation> {
  const session = await ensureVisitorSession()
  const supabase = getSupabaseClient()
  const existingId = typeof window !== "undefined" ? window.localStorage.getItem(CONVERSATION_KEY) : null

  if (existingId) {
    const { data } = await supabase.from("chat_conversations").select("*").eq("id", existingId).maybeSingle()
    if (data) return data as ChatConversation
  }

  const { data, error } = await supabase
    .from("chat_conversations")
    .insert({ visitor_id: session.user.id })
    .select("*")
    .single()
  if (error || !data) throw error ?? new Error("Couldn't start a conversation")
  window.localStorage.setItem(CONVERSATION_KEY, data.id)
  return data as ChatConversation
}

// Admin-only (RLS: is_admin() sees every conversation, a visitor only
// their own) — the admin console lists all of them here.
export async function fetchConversations(): Promise<ChatConversation[]> {
  const { data } = await getSupabaseClient().from("chat_conversations").select("*").order("last_message_at", { ascending: false })
  return (data as ChatConversation[]) ?? []
}

export async function setConversationStatus(id: string, status: ChatConversation["status"]) {
  await getSupabaseClient().from("chat_conversations").update({ status }).eq("id", id)
}

export async function fetchMessages(conversationId: string): Promise<ChatMessageRow[]> {
  const { data } = await getSupabaseClient()
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
  return (data as ChatMessageRow[]) ?? []
}

export async function sendMessage(conversationId: string, sender: ChatSender, body: string) {
  const { error } = await getSupabaseClient().from("chat_messages").insert({ conversation_id: conversationId, sender, body })
  if (error) throw error
}

// Realtime subscription for one conversation's new messages — used by
// the visitor widget for its own conversation.
export function subscribeToConversation(conversationId: string, onInsert: (message: ChatMessageRow) => void) {
  const channel = getSupabaseClient()
    .channel(`chat_messages:${conversationId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${conversationId}` },
      (payload) => onInsert(payload.new as ChatMessageRow)
    )
    .subscribe()
  return () => {
    getSupabaseClient().removeChannel(channel)
  }
}

// Admin console needs every conversation's new messages at once (to
// reorder/badge the list), so it uses one unfiltered subscription instead
// of one channel per conversation.
export function subscribeToAllMessages(onInsert: (message: ChatMessageRow) => void) {
  const channel = getSupabaseClient()
    .channel("chat_messages:all")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => onInsert(payload.new as ChatMessageRow))
    .subscribe()
  return () => {
    getSupabaseClient().removeChannel(channel)
  }
}
