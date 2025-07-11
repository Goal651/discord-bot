"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DiscordChannel } from "@/types/discord"

interface ChannelSelectorProps {
  channels: DiscordChannel[]
  activeChannel: string | null
  onChannelChange: (channelId: string) => void
}

export function ChannelSelector({ channels, activeChannel, onChannelChange }: ChannelSelectorProps) {
  return (
    <Card className="bg-background/50 backdrop-blur-sm border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Active Channels</h3>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {channels.length} connected
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {channels.map((channel) => (
            <Button
              key={channel.id}
              onClick={() => onChannelChange(channel.id)}
              variant={activeChannel === channel.id ? "default" : "outline"}
              className={`relative overflow-hidden transition-all duration-300 ${
                activeChannel === channel.id
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                  : "border-primary/30 hover:border-primary/60 hover:bg-primary/10"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{channel.type === "text" ? "💬" : "🔊"}</span>
                <div className="text-left">
                  <div className="font-semibold">{channel.name}</div>
                  <div className="text-xs opacity-70">{channel.serverName}</div>
                </div>
                {channel.unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs px-1 py-0 min-w-[20px] h-5">
                    {channel.unreadCount > 99 ? "99+" : channel.unreadCount}
                  </Badge>
                )}
              </div>

              {activeChannel === channel.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse"></div>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
