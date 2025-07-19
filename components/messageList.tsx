"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCard } from "./messageCard"
import type { DiscordMessage } from "@/types/discord"
import type { DiscordChannel } from "@/types/discord"
import { Volume2 } from "lucide-react"

interface MessageStreamProps {
  isConnected: boolean
  activeChannel?: DiscordChannel | null
  messages?: DiscordMessage[]
  connectionStatus: string
}

export function MessageStream({ isConnected, activeChannel, messages: propMessages, connectionStatus }: MessageStreamProps) {
  const messages = propMessages ?? []
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showScrollToLatest, setShowScrollToLatest] = useState(false)

  // Helper: is user near the bottom?
  const isUserNearBottom = () => {
    const container = containerRef.current
    if (!container) return true
    const threshold = 120 // px
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold
  }

  // Scroll handler
  const handleScroll = () => {
    setShowScrollToLatest(!isUserNearBottom())
  }

  // Scroll to bottom if user is near bottom
  useEffect(() => {
    if (isUserNearBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      setShowScrollToLatest(false)
    } else {
      setShowScrollToLatest(true)
    }
  }, [messages])

  if (!activeChannel) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#23272a]/90 rounded-xl shadow-lg">
        <div className="text-gray-300">
          <div className="mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-500 mb-2">
              <line x1="4" y1="9" x2="20" y2="9" />
              <line x1="4" y1="15" x2="20" y2="15" />
              <line x1="10" y1="3" x2="8" y2="21" />
              <line x1="16" y1="3" x2="14" y2="21" />
            </svg>
            <p className="text-lg text-white">No channel selected</p>
            <p className="text-sm mt-2 text-gray-400">Please select a channel to view messages.</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#23272a]/90 rounded-xl shadow-lg">
        <div className="text-gray-300">
          <div className="animate-pulse mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 animate-spin"></div>
          </div>
          <p className="text-lg text-white">Connecting to Discord stream...</p>
          <p className="text-sm mt-2 text-gray-400">Initializing gaming console...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#23272a] bg-[#2f3136] w-full shadow-sm">
        <div className="flex items-center gap-3">
          <span className="mr-1">
            {activeChannel?.type === "text" ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <line x1="4" y1="9" x2="20" y2="9" />
                <line x1="4" y1="15" x2="20" y2="15" />
                <line x1="10" y1="3" x2="8" y2="21" />
                <line x1="16" y1="3" x2="14" y2="21" />
              </svg>
            ) : (
              <Volume2 size={22} className="text-gray-400" strokeWidth={2.2} />
            )}
          </span>
          <div>
            <span className="text-white font-bold text-lg drop-shadow-sm">{activeChannel?.name || "Loading..."}</span>
            {activeChannel && <div className="text-sm text-gray-400">Server: {activeChannel.serverName}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{messages.length} messages</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-0 py-4 space-y-2 custom-scrollbar bg-[#36393f] relative"
      >
        {showScrollToLatest && (
          <button
            onClick={() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
              setShowScrollToLatest(false)
            }}
            className="fixed bottom-24 right-8 z-20 bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all animate-fade-in-up"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.18)' }}
          >
            Scroll to latest
          </button>
        )}
        {messages.length === 0 ? (
          connectionStatus === 'connecting' ? (
            <div className="flex flex-col gap-3 p-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <span className="w-10 h-10 rounded-full bg-[#23272a] border border-[#36393f]" />
                  <span className="flex-1 flex flex-col gap-2">
                    <span className="w-32 h-4 bg-[#36393f] rounded" />
                    <span className="w-48 h-3 bg-[#36393f] rounded" />
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-60 text-center rounded-lg bg-gradient-to-b from-[#23272a]/80 to-[#36393f]/90 shadow-inner animate-in fade-in duration-500">
              <div className="text-5xl mb-3 animate-bounce-slow select-none">💬</div>
              <div className="text-white text-xl font-semibold mb-1 drop-shadow">Waiting for new messages...</div>
              <div className="text-gray-400 text-base">No messages in this channel yet. Start the conversation!</div>
            </div>
          )
        ) : (
          <>
            {messages.map((message, index) => {
              const prev = messages[index - 1]
              const isGrouped =
                prev &&
                prev.author.id === message.author.id &&
                // within 5 minutes
                Math.abs(new Date(message.timestamp).getTime() - new Date(prev.timestamp).getTime()) < 5 * 60 * 1000
              return (
                <div key={message.id} className="animate-fade-in-up">
                  <MessageCard message={message} isLatest={index === messages.length - 1} grouped={!!isGrouped} />
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </>
  )
}
