"use client"

import { useEffect, useState, useCallback } from "react"
import { MessageStream } from "@/components/messageList"
import { ConnectionStatus } from "@/components/connectionStatus"
import { useRouter } from "next/navigation"
import { useSocket } from "@/context/Socket"
import { useBot } from "@/hooks/useBot"
import { FaDiscord } from "react-icons/fa"
import { WS_ENDPOINTS } from "@/api/constant"

export default function Home() {
  const socket = useSocket()
  const [activeChannel, setActiveChannel] = useState<string | null>(null)
  const { channels, messages, connectionStatus } = useBot({ activeChannel })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) router.push("/login")
  }, [])


  const handleChannelChange = useCallback((channelId: string) => {
    if (!socket) return

    if (activeChannel) socket.send(WS_ENDPOINTS.CHANNELS.LEAVE, { channelId: activeChannel })
    setActiveChannel(channelId)
    socket.send(WS_ENDPOINTS.CHANNELS.JOIN, { channelId })
  }, [activeChannel, socket],)

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#23272a] via-[#2c2f33] to-[#23272a]">
      {/* Sidebar for channels */}
      <aside className="w-64 bg-gradient-to-b from-[#23272a] to-[#2c2f33] text-white border-r border-[#36393f] flex flex-col shadow-lg">
        <div className="p-6 border-b border-[#36393f] flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-wide">Channels</h2>

        </div>
        <nav className="flex-1 overflow-y-auto">
          {channels.length > 0 ? (
            <ul>
              {channels.map((channel) => (
                <li key={channel.id}>
                  <button
                    className={`w-full flex items-center gap-3 text-left px-6 py-3 transition rounded-none border-l-4 ${activeChannel === channel.id ? "bg-[#2c2f33] border-[#7289da] font-semibold" : "hover:bg-[#36393f]/60 border-transparent"}`}
                    onClick={() => handleChannelChange(channel.id)}
                  >
                    {/* Avatar */}
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#23272a] border border-[#36393f] mr-1">
                      <FaDiscord />
                    </span>
                    {/* Hashtag icon as inline SVG */}
                    <span className="flex items-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <line x1="4" y1="9" x2="20" y2="9" />
                        <line x1="4" y1="15" x2="20" y2="15" />
                        <line x1="10" y1="3" x2="8" y2="21" />
                        <line x1="16" y1="3" x2="14" y2="21" />
                      </svg>
                    </span>
                    <span className="truncate">{channel.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-[#b9bbbe]">No channels</div>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-[#23272a] via-[#2c2f33] to-[#23272a]">
        {/* Restyled header: smaller, minimal, less prominent */}
        <header className="px-8 py-3 border-b border-[#36393f] flex items-center justify-between bg-[#23272a]/80 sticky top-0 z-10 shadow-sm backdrop-blur-md">
          <h1 className="text-lg font-semibold text-[#b9bbbe] tracking-tight">Discord Stream Console</h1>
          <div className="flex items-center space-x-4">
            <ConnectionStatus status={connectionStatus} />
          </div>
        </header>
        <section className="flex-1 flex flex-col items-center justify-center bg-transparent">
          <div className="flex-1 overflow-y-auto px-0 py-4 w-full">
            <MessageStream
              isConnected={connectionStatus === "connected"}
              activeChannel={channels.find(c => c.id === activeChannel)}
              messages={messages}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
