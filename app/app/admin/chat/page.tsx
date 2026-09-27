"use client"

import { ChatConsole } from "@/components/admin/chat-console"

export default function AdminChatPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Chat</h1>
      <p className="mt-1 text-sm text-text-secondary">Live conversations started from the site chat widget.</p>
      <div className="mt-6">
        <ChatConsole />
      </div>
    </div>
  )
}
