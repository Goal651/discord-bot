"use client"

import { useEffect, useState } from "react"
import { MessageStream } from "@/components/message-stream"
import { ConnectionStatus } from "@/components/connection-status"
import { ThemeSelector } from "@/components/theme-selector"
import { ChannelSelector } from "@/components/channel-selector"
import { WebSocketManager } from "@/lib/websocket-manager"
import { MessageStore } from "@/lib/message-store"
import { ThemeManager } from "@/lib/theme-manager"
import { ChannelManager } from "@/lib/channel-manager"
import type { DiscordMessage, DiscordChannel } from "@/types/discord"

export default function Home() {
  const [messages, setMessages] = useState<DiscordMessage[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [currentTheme, setCurrentTheme] = useState("cyberpunk")
  const [channels, setChannels] = useState<DiscordChannel[]>([])
  const [activeChannel, setActiveChannel] = useState<string | null>(null)

  const [wsManager] = useState(() => new WebSocketManager())
  const [messageStore] = useState(() => new MessageStore())
  const [themeManager] = useState(() => new ThemeManager())
  const [channelManager] = useState(() => new ChannelManager())

  useEffect(() => {
    // Apply theme to document
    themeManager.applyTheme(currentTheme)

    // Initialize WebSocket connection
    wsManager.connect("ws://localhost:3000")

    // Set up event listeners
    wsManager.onConnectionChange((status) => {
      setConnectionStatus(status)
    })

    wsManager.onMessage((message) => {
      if (!activeChannel || message.channelId === activeChannel) {
        messageStore.addMessage(message)
        setMessages([...messageStore.getMessages()])
      }
    })

    wsManager.onChannelsUpdate((channelList) => {
      channelManager.setChannels(channelList)
      setChannels([...channelManager.getChannels()])

      // Auto-select first channel if none selected
      if (!activeChannel && channelList.length > 0) {
        setActiveChannel(channelList[0].id)
      }
    })

    wsManager.onError((error) => {
      console.error("WebSocket error:", error)
      setConnectionStatus("disconnected")
    })

    return () => {
      wsManager.disconnect()
    }
  }, [wsManager, messageStore, themeManager, channelManager, currentTheme, activeChannel])

  const handleChannelChange = (channelId: string) => {
    setActiveChannel(channelId)
    messageStore.clearMessages()
    setMessages([])

    // Request messages for new channel
    wsManager.send({
      type: "switch_channel",
      payload: { channelId },
    })
  }

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme)
    themeManager.applyTheme(theme)
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeManager.getThemeClasses(currentTheme)}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Discord Stream Console
            </h1>
            <div className="flex items-center space-x-4">
              <ThemeSelector currentTheme={currentTheme} onThemeChange={handleThemeChange} />
              <ConnectionStatus status={connectionStatus} />
            </div>
          </div>

          {channels.length > 0 && (
            <ChannelSelector channels={channels} activeChannel={activeChannel} onChannelChange={handleChannelChange} />
          )}
        </header>

        <main className="max-w-6xl mx-auto">
          <MessageStream
            messages={messages}
            isConnected={connectionStatus === "connected"}
            activeChannel={channelManager.getChannelById(activeChannel || "")}
          />
        </main>
      </div>

      {/* Gaming RGB border effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 border-2 border-gradient-to-r from-primary via-secondary to-accent opacity-20 animate-pulse"></div>
      </div>
    </div>
  )
}
