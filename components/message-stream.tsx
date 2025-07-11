"use client"

import { useEffect, useRef } from "react"
import { MessageCard } from "./message-card"
import type { DiscordMessage } from "@/types/discord"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DiscordChannel } from "@/types/discord"

interface MessageStreamProps {
  messages: DiscordMessage[]
  isConnected: boolean
  activeChannel?: DiscordChannel | null
}

export function MessageStream({ messages, isConnected, activeChannel }: MessageStreamProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!isConnected && messages.length === 0) {
    return (
      <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <div className="animate-pulse mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 animate-spin"></div>
            </div>
            <p className="text-lg">Connecting to Discord stream...</p>
            <p className="text-sm mt-2">Initializing gaming console...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-primary/20 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{activeChannel?.type === "text" ? "💬" : "🔊"}</span>
            <div>
              <span className="text-primary">#{activeChannel?.name || "Loading..."}</span>
              {activeChannel && <div className="text-sm text-muted-foreground">{activeChannel.serverName}</div>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white">{messages.length} messages</Badge>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          <div className="space-y-4 p-6">
            {messages.map((message, index) => (
              <MessageCard key={message.id} message={message} isLatest={index === messages.length - 1} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
