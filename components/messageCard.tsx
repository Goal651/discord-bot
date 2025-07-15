"use client"

import type { DiscordMessage } from "@/types/discord"
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
    <div
      className={`group flex items-start gap-3 px-4 py-2 rounded transition-all duration-200 relative ${
        isLatest ? "bg-primary/10" : "hover:bg-muted/60"
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarImage src={message.author.avatar || `/placeholder.svg?height=48&width=48`} alt={message.author.username} />
          <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white font-bold">
            {message.author.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isLatest && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping border-2 border-card"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-semibold text-primary text-[1.05rem] leading-tight group-hover:underline cursor-pointer text-white">
            {message.author.username}
          </span>
          {message.author.bot && <Badge className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0 ml-1">BOT</Badge>}
          <span className="text-xs text-muted-foreground ml-1 mt-0.5 text-gray-300">{formattedTime}</span>
        </div>
        <div className="break-words leading-relaxed text-[0.98rem] text-white">
          <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
        </div>
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-2 py-1 rounded bg-muted/60 text-sm text-primary hover:bg-muted/80 transition-colors text-gray-300"
              >
                <span className="text-lg">📎</span>
                <span className="truncate max-w-[120px]">{attachment.filename}</span>
                <Badge variant="outline" className="text-xs border-none bg-transparent text-muted-foreground px-1 text-gray-400">
                  {(attachment.size / 1024).toFixed(1)}KB
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
