"use client"

import type { DiscordMessage } from "@/types/discord"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageFormatter } from "@/lib/messageFormatter"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import React from "react"

interface MessageCardProps {
  message: DiscordMessage
  isLatest?: boolean
  grouped?: boolean
}

export function MessageCard({ message, isLatest = false, grouped = false }: MessageCardProps) {
  const formatter = new MessageFormatter()
  const formattedTime = formatter.formatTimestamp(message.timestamp)
  const formattedContent = formatter.formatContent(message.content)
  const [openImageIndex, setOpenImageIndex] = React.useState<number | null>(null)

  return (
    <div
      className={`group flex items-start gap-3 px-4 ${grouped ? 'pt-1 pb-0' : 'py-2'} rounded transition-all duration-200 relative ${
        isLatest ? "bg-primary/10" : "hover:bg-muted/60"
      }`}
    >
      {!grouped && (
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
      )}
      <div className="flex-1 min-w-0">
        {!grouped && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="font-semibold text-primary text-[1.05rem] leading-tight group-hover:underline cursor-pointer text-white">
              {message.author.username}
            </span>
            {message.author.bot && <Badge className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0 ml-1">BOT</Badge>}
            <span className="text-xs text-muted-foreground ml-1 mt-0.5 text-gray-300">{formattedTime}</span>
          </div>
        )}
        <div className="break-words leading-relaxed text-[0.98rem] text-white">
          <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
        </div>
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((attachment, index) => {
              const type = attachment.contentType || '';
              const url = attachment.proxyUrl || attachment.url;
              const isImage = type.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(attachment.filename);
              const isVideo = type.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/i.test(attachment.filename);
              const isAudio = type.startsWith('audio/') || /\.(mp3|wav|ogg|aac)$/i.test(attachment.filename);
              return (
                <React.Fragment key={index}>
                  {isImage ? (
                    <Dialog open={openImageIndex === index} onOpenChange={open => setOpenImageIndex(open ? index : null)}>
                      <DialogTrigger asChild>
                        <img
                          src={url}
                          alt={attachment.filename}
                          className="rounded max-h-48 max-w-xs border border-muted shadow cursor-pointer hover:opacity-80"
                          style={{ objectFit: 'contain', background: '#23272a' }}
                          loading="lazy"
                          onClick={() => setOpenImageIndex(index)}
                        />
                      </DialogTrigger>
                      <DialogContent className="flex flex-col items-center justify-center bg-black p-4 max-w-2xl">
                        <img
                          src={url}
                          alt={attachment.filename}
                          className="rounded max-h-[80vh] max-w-full border border-muted shadow bg-black"
                          style={{ objectFit: 'contain' }}
                        />
                        <div className="text-xs text-gray-400 mt-2">{attachment.filename} &middot; {(attachment.size / 1024).toFixed(1)}KB</div>
                      </DialogContent>
                    </Dialog>
                  ) : isVideo ? (
                    <video
                      src={url}
                      controls
                      className="rounded max-h-48 max-w-xs border border-muted shadow bg-black"
                      style={{ objectFit: 'contain' }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : isAudio ? (
                    <audio
                      src={url}
                      controls
                      className="w-full mt-1"
                    >
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-lg">📎</span>
                      <span className="truncate max-w-[120px]">{attachment.filename}</span>
                      <Badge variant="outline" className="text-xs border-none bg-transparent text-muted-foreground px-1 text-gray-400">
                        {(attachment.size / 1024).toFixed(1)}KB
                      </Badge>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-blue-400 text-xs mt-1">Download</a>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
