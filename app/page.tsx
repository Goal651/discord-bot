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
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [messages, setMessages] = useState<any[]>([])
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [currentTheme, setCurrentTheme] = useState("cyberpunk")
  const [channels, setChannels] = useState<DiscordChannel[]>([])
  const [activeChannel, setActiveChannel] = useState<string | null>(null)
  const [showAddChannelModal, setShowAddChannelModal] = useState(false)
  const [newChannelName, setNewChannelName] = useState("")
  const [newChannelId, setNewChannelId] = useState("")
  const [availableDiscordChannels, setAvailableDiscordChannels] = useState<any[]>([])
  const [selectedDiscordChannelId, setSelectedDiscordChannelId] = useState("")
  const [lastChannel, setLastChannel] = useState<string | null>(null)

  const wsManager = websocketService
  const [messageStore] = useState(() => new MessageStore())
  const [themeManager] = useState(() => new ThemeManager())
  const [channelManager] = useState(() => new ChannelManager())

  const { token, logout, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(()=>{
    wsManager.onMessage((a)=>{
      console.log(a)
    })
  },[wsManager])

  useEffect(() => {
    const socket = websocketService.getSocket()
    console.log(socket)
    if (!socket) return
    const handleMessage = (msg: any) => {
      console.log("[Socket.IO][page.tsx] Received message:", msg)
    }
    socket.on("message", handleMessage)
    return () => {
      socket.off("message", handleMessage)
    }
  }, [websocketService.getSocket()])

  // Listen for incoming messages and store them in state, filtered by channel
  useEffect(() => {
    const socket = websocketService.getSocket()
    if (!socket) return
    const handleMessage = (msg: any) => {
      // Only store messages for the active channel
      if (msg.channelId === activeChannel) {
        setMessages(prev => [...prev, msg])
      }
    }
    socket.on("message", handleMessage)
    return () => {
      socket.off("message", handleMessage)
    }
  }, [activeChannel, websocketService.getSocket()])

  // Clear messages when switching channels
  useEffect(() => {
    if (lastChannel !== activeChannel) {
      setMessages([])
      setLastChannel(activeChannel)
    }
  }, [activeChannel, lastChannel])

  // Only connect/disconnect websocket when token changes (not on channel change)
  useEffect(() => {
    if (token) {
      wsManager.connect("http://localhost:3001/discord", token)
      return () => {
        wsManager.disconnect()
      }
    }
  }, [token])

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }
    // Apply theme to document
    themeManager.applyTheme(currentTheme)

    wsManager.onConnectionChange((status) => {
      setConnectionStatus(status)
    })

    wsManager.onMessage((message) => {
      if (!activeChannel || message.channelId === activeChannel) {
        messageStore.addMessage(message)
        // setMessages([...messageStore.getMessages()]) // Remove if not needed
      }
    })

    wsManager.onError((error) => {
      console.error("Socket.IO error:", error)
      setConnectionStatus("disconnected")
      toast({ title: "Connection Error", description: error.message })
    })

    // Fetch channels via REST
    channelApi.getChannels().then(setChannels)

  }, [messageStore, themeManager, channelManager, currentTheme, activeChannel, token, router, toast])



  useEffect(() => {
    if (showAddChannelModal) {
      channelApi.getAvailableDiscordChannels().then(setAvailableDiscordChannels)
    }
  }, [showAddChannelModal])

  const [newMessage, setNewMessage] = useState("")
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeChannel) return
    try {
      await messageApi.sendMessage({ channelId: activeChannel, content: newMessage })
      setNewMessage("")
      // Refresh messages
      messageApi.getMessages(activeChannel).then(setMessages)
    } catch (err: any) {
      toast({ title: "Failed to send message", description: err?.response?.data?.message || "An error occurred.", })
    }
  }

  const handleChannelChange = useCallback(
    (channelId: string) => {
      if (activeChannel) {
        wsManager.send("leave_channel", { channelId: activeChannel })
      }
      setActiveChannel(channelId)
      // No messageStore.clearMessages(), no setMessages([]), no fetching
      wsManager.send("join_channel", { channelId }, (response) => {
        if (!response.success) {
          // Optionally handle error
          console.error(`Failed to join channel ${channelId}:`, response.error)
        }
      })
    },
    [activeChannel, wsManager],
  )

  const handleThemeChange = useCallback(
    (theme: string) => {
      setCurrentTheme(theme)
      themeManager.applyTheme(theme)
    },
    [themeManager],
  )

  async function handleAddChannel() {
    const name = prompt("Enter new channel name:")
    if (!name) return
    try {
      await channelApi.addChannel({ name })
      toast({ title: "Channel Created", description: `#${name} has been added.` })
      // Refresh channel list
      channelApi.getChannels().then(setChannels)
    } catch (err: any) {
      toast({ title: "Failed to add channel", description: err?.message || "An error occurred." })
    }
  }

  async function handleAddChannelSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDiscordChannelId) return
    try {
      await channelApi.addChannelByDiscordId(selectedDiscordChannelId)
      toast({ title: "Channel Added", description: `Channel ${selectedDiscordChannelId} has been added.` })
      setSelectedDiscordChannelId("")
      setShowAddChannelModal(false)
      // Refresh channel list via REST
      channelApi.getChannels().then(setChannels)
    } catch (err: any) {
      toast({ title: "Failed to add channel", description: err?.message || "An error occurred." })
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#23272a] via-[#2c2f33] to-[#23272a]">
      {/* Sidebar for channels */}
      <aside className="w-64 bg-[#23272a] text-white border-r border-[#36393f] flex flex-col">
        <div className="p-6 border-b border-[#36393f] flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-wide">Channels</h2>
          <button
            onClick={() => setShowAddChannelModal(true)}
            className="ml-2 px-3 py-1 rounded bg-[#7289da] text-white font-bold shadow hover:bg-[#5b6eae] transition text-lg"
            title="Add Channel"
          >
            +
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {channels.length > 0 ? (
            <ul>
              {channels.map((channel) => (
                <li key={channel.id}>
                  <button
                    className={`w-full text-left px-6 py-3 transition rounded-none border-l-4 ${activeChannel === channel.id ? "bg-[#2c2f33] border-[#7289da] font-semibold" : "hover:bg-[#36393f]/60 border-transparent"}`}
                    onClick={() => handleChannelChange(channel.id)}
                  >
                    #{channel.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-[#b9bbbe]">No channels</div>
          )}
        </nav>
      </aside>
      {/* Add Channel Modal */}
      {showAddChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#2c2f33] rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-[#23272a] flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-4">Add Channel</h3>
            <form onSubmit={handleAddChannelSubmit} className="w-full space-y-4">
              <label className="block text-[#b9bbbe] mb-1 text-sm font-semibold">Select a Discord Channel</label>
              <select
                value={selectedDiscordChannelId}
                onChange={e => setSelectedDiscordChannelId(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-[#23272a] bg-[#36393f] text-white focus:outline-none focus:ring-2 focus:ring-[#7289da]"
              >
                <option value="" disabled>Select a channel...</option>
                {availableDiscordChannels.map((ch: any) => (
                  <option key={ch.id} value={ch.id}>{ch.name} ({ch.id})</option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddChannelModal(false)}
                  className="px-4 py-2 rounded bg-[#36393f] text-[#b9bbbe] hover:bg-[#23272a] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#7289da] text-white font-bold shadow hover:bg-[#5b6eae] transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Restyled header: smaller, minimal, less prominent */}
        <header className="px-8 py-3 border-b border-[#36393f] flex items-center justify-between bg-transparent">
          <h1 className="text-lg font-semibold text-[#b9bbbe] tracking-tight">Discord Stream Console</h1>
          <div className="flex items-center space-x-4">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={handleThemeChange} />
            <ConnectionStatus status={connectionStatus} />
          </div>
        </header>
        <section className="flex-1 flex flex-col items-center justify-center bg-transparent">
          <div className="w-full max-w-3xl flex-1 flex flex-col rounded-2xl shadow-2xl bg-[#23272a]/90 mt-8 mb-4 overflow-hidden border border-[#36393f]">
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <MessageStream
                isConnected={connectionStatus === "connected"}
                activeChannel={channels.find(c => c.id === activeChannel)}
                messages={messages}
              />
            </div>
            {/* Removed send message form and container */}
          </div>
        </section>
      </main>
    </div>
  )
}
