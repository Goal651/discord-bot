"use client"

import { useEffect, useState, useCallback } from "react"
import { MessageStream } from "@/components/message-stream"
import { ConnectionStatus } from "@/components/connection-status"
import { ThemeSelector } from "@/components/theme-selector"
import { ChannelSelector } from "@/components/channel-selector"
import { websocketService } from "@/api/websocket-service"
import { MessageStore } from "@/lib/message-store"
import { ThemeManager } from "@/lib/theme-manager"
import { ChannelManager } from "@/lib/channel-manager"
import type { DiscordMessage, DiscordChannel } from "@/types/discord"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { channelApi } from "@/api/channel"
import { messageApi } from "@/api/message"

export default function Home() {
  const [messages, setMessages] = useState<DiscordMessage[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [currentTheme, setCurrentTheme] = useState("cyberpunk")
  const [channels, setChannels] = useState<DiscordChannel[]>([])
  const [activeChannel, setActiveChannel] = useState<string | null>(null)

  const wsManager = websocketService
  const [messageStore] = useState(() => new MessageStore())
  const [themeManager] = useState(() => new ThemeManager())
  const [channelManager] = useState(() => new ChannelManager())

  const { token, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }
    // Apply theme to document
    themeManager.applyTheme(currentTheme)

    // Initialize Socket.IO connection with token
    wsManager.connect("http://localhost:3001/discord", token)

    // Set up event listeners
    wsManager.onConnectionChange((status) => {
      setConnectionStatus(status)
    })

    wsManager.onMessage((message) => {
      // Only add message if it belongs to the active channel or no channel is active yet
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
        // Immediately join the first channel
        wsManager.send("join_channel", { channelId: channelList[0].id })
      }
    })

    wsManager.onError((error) => {
      console.error("Socket.IO error:", error)
      setConnectionStatus("disconnected")
      // Potentially show a toast notification for the error
    })

    // Request initial channels list from the server
    wsManager.send("get_channels")

    return () => {
      wsManager.disconnect()
    }
  }, [messageStore, themeManager, channelManager, currentTheme, activeChannel, token, router])

  useEffect(() => {
    if (activeChannel) {
      // Fetch messages for the selected channel
      messageApi.getMessages(activeChannel).then(setMessages)
    }
  }, [activeChannel])

  const [newMessage, setNewMessage] = useState("")
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeChannel) return
    await messageApi.sendMessage({ channelId: activeChannel, content: newMessage })
    setNewMessage("")
    // Refresh messages
    messageApi.getMessages(activeChannel).then(setMessages)
  }

  const handleChannelChange = useCallback(
    (channelId: string) => {
      if (activeChannel) {
        wsManager.send("leave_channel", { channelId: activeChannel })
      }
      setActiveChannel(channelId)
      messageStore.clearMessages()
      setMessages([])

      // Request to join the new channel
      wsManager.send("join_channel", { channelId }, (response) => {
        if (response.success) {
          console.log(`Successfully joined channel: ${channelId}`)
          // Optionally request history for the new channel after joining
          wsManager.send("request_history", { channelId, limit: 50 })
        } else {
          console.error(`Failed to join channel ${channelId}:`, response.error)
          // Handle error, maybe revert activeChannel or show a message
        }
      })
    },
    [activeChannel, messageStore],
  )

  const handleThemeChange = useCallback(
    (theme: string) => {
      setCurrentTheme(theme)
      themeManager.applyTheme(theme)
    },
    [themeManager],
  )

  return (
    <div className={`min-h-screen flex bg-background transition-all duration-500 ${themeManager.getThemeClasses(currentTheme)}`}>
      {/* Sidebar for channels */}
      <aside className="w-64 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-r border-[hsl(var(--sidebar-border))] flex flex-col">
        <div className="p-6 border-b border-[hsl(var(--sidebar-border))] flex items-center justify-between">
          <h2 className="text-xl font-bold">Channels</h2>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {channels.length > 0 ? (
            <ul>
              {channels.map((channel) => (
                <li key={channel.id}>
                  <button
                    className={`w-full text-left px-6 py-3 transition rounded-none border-l-4 ${activeChannel === channel.id ? "bg-[hsl(var(--sidebar-accent))] border-[hsl(var(--sidebar-ring))] font-semibold" : "hover:bg-[hsl(var(--sidebar-accent))]/60 border-transparent"}`}
                    onClick={() => setActiveChannel(channel.id)}
                  >
                    #{channel.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-muted-foreground">No channels</div>
          )}
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="px-8 py-6 border-b border-[hsl(var(--border))] flex items-center justify-between bg-card/80 backdrop-blur-md">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Discord Stream Console</h1>
          <div className="flex items-center space-x-4">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={handleThemeChange} />
            <ConnectionStatus status={connectionStatus} />
          </div>
        </header>
        <section className="flex-1 flex flex-col items-center justify-center bg-background">
          <div className="w-full max-w-3xl flex-1 flex flex-col rounded-2xl shadow-lg bg-card/90 mt-8 mb-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <MessageStream
                messages={messages}
                isConnected={connectionStatus === "connected"}
                activeChannel={channels.find(c => c.id === activeChannel)}
              />
            </div>
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-[hsl(var(--border))] bg-background/80 px-4 py-3">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-none outline-none bg-transparent px-3 py-2 text-base"
              />
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition">Send</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
