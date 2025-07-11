"use client"

import type { DiscordMessage } from "@/types/discord"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageFormatter } from "@/lib/message-formatter"
import { Badge } from "@/components/ui/badge"

interface MessageCardProps {
  message: DiscordMessage
  isLatest?: boolean
}

export function MessageCard({ message, isLatest = false }: MessageCardProps) {
  const formatter = new MessageFormatter()
  const formattedTime = formatter.formatTimestamp(message.timestamp)
  const formattedContent = formatter.formatContent(message.content)

  return (
    <Card
      className={`bg-background/30 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 ${
        isLatest ? "ring-2 ring-primary/50 shadow-lg shadow-primary/20 animate-pulse-slow" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <Avatar className="w-10 h-10 ring-2 ring-primary/30">
              <AvatarImage src={message.authorAvatar || `/placeholder.svg?height=40&width=40`} alt={message.author} />
              <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white font-bold">
                {message.author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isLatest && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-primary">{message.author}</span>
              <span className="text-xs text-muted-foreground">{formattedTime}</span>
              {message.isBot && <Badge className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0">BOT</Badge>}
            </div>

            <div className="text-foreground break-words">
              <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
            </div>

            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>📎</span>
                    <span>{attachment.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {(attachment.size / 1024).toFixed(1)}KB
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
