"use client"

import { ChatConsole } from "@/components/admin/chat-console"

// No page header here — the shell gives /admin/chat the full viewport, and
// the console's own panes carry the titles.
export default function AdminChatPage() {
  return <ChatConsole />
}
