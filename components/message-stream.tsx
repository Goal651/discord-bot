"use client"

import { useEffect, useRef } from "react"
import { MessageCard } from "./message-card"
import type { DiscordMessage } from "@/types/discord"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DiscordChannel } from "@/types/discord"
import { useDiscordChannelMessages } from "@/hooks/use-discord-channel-messages"

interface MessageStreamProps {
  isConnected: boolean
  activeChannel?: DiscordChannel | null
  messages?: DiscordMessage[]
}

export function MessageStream({ isConnected, activeChannel, messages: propMessages }: MessageStreamProps) {
  const messages = propMessages ?? useDiscordChannelMessages(activeChannel?.id || null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!isConnected && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-background/70 rounded-xl shadow-lg">
        <div className="text-muted-foreground">
          <div className="animate-pulse mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 animate-spin"></div>
          </div>
          <p className="text-lg">Connecting to Discord stream...</p>
          <p className="text-sm mt-2">Initializing gaming console...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background/80 rounded-xl shadow-lg border border-[hsl(var(--border))] h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-[hsl(var(--border))] bg-card/80">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{activeChannel?.type === "text" ? "💬" : "🔊"}</span>
          <div>
            <span className="text-primary font-semibold">#{activeChannel?.name || "Loading..."}</span>
            {activeChannel && <div className="text-xs text-muted-foreground">{activeChannel.serverName}</div>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">{messages.length} messages</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-4">
        {messages.map((message, index) => (
          <MessageCard key={message.id} message={message} isLatest={index === messages.length - 1} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
