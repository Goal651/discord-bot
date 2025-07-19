"use client"

import { useState } from "react"
import { MessageStream } from "@/components/messageList"
import { ConnectionStatus } from "@/components/connectionStatus"
import { useBot } from "@/hooks/useBot"
import { FaDiscord } from "react-icons/fa"
import Image from "next/image"
import { FiSettings } from "react-icons/fi"
import { FiMenu, FiX } from "react-icons/fi"
import LoadingScreen from "@/components/LoadingScreen"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const defaultAvatar = "/placeholder.svg?height=64&width=64";
  const {
    userInfo,
    channels,
    filteredChannels,
    messages,
    connectionStatus,
    activeChannel,
    setActiveChannel,
    channelSearch,
    setChannelSearch } = useBot()

  if (connectionStatus == 'connecting') return <LoadingScreen />


  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#23272a] via-[#2c2f33] to-[#23272a]">
      {/* Sidebar for channels (responsive drawer) */}
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed md:static top-0 left-0 z-50 w-72 h-full bg-gradient-to-b from-[#23272a] to-[#2c2f33] text-white border-r border-[#36393f] flex flex-col shadow-2xl transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex md:relative`}
        style={{ minHeight: '100vh' }}
      >
        {/* User profile section */}
        <div className="flex flex-col items-center gap-2 px-6 py-6 border-b border-[#36393f] bg-[#23272a]/80 relative">
          {/* Settings button */}
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#36393f]/80 transition"
            title="Settings / Logout"
            onClick={() => alert('Settings/Logout coming soon!')}
          >
            <FiSettings className="text-xl text-gray-400 hover:text-primary transition" />
          </button>
          {userInfo ? (
            <>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-lg">
                <Image src={userInfo.avatar || defaultAvatar} alt={userInfo.username} width={64} height={64} className="w-16 h-16 object-cover" />
              </div>
              <div className="text-lg font-bold text-white mt-2">{userInfo.displayName || userInfo.username}</div>
              <div className="text-xs text-gray-400">@{userInfo.username}</div>
              {userInfo.isBot && (
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-semibold mt-1">BOT</span>
              )}
              {userInfo.createdAt && (
                <div className="text-xs text-gray-500 mt-1">
                  Member since {new Date(userInfo.createdAt).toLocaleDateString()}
                </div>
              )}
            </>
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#36393f] animate-pulse mb-2" />
          )}
        </div>
        {/* Channels header */}
        <div className="flex flex-col gap-2 px-6 py-3 border-b border-[#36393f] bg-[#23272a]/90">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
              <FaDiscord className="text-[#7289da]" /> Channels
            </h2>
          </div>
          <input
            type="text"
            value={channelSearch}
            onChange={e => setChannelSearch(e.target.value)}
            placeholder="Search channels..."
            className="mt-1 w-full rounded bg-[#23272a] border border-[#36393f] px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
        </div>
        <nav className="flex-1 overflow-y-auto bg-gradient-to-b from-[#23272a]/80 to-[#2c2f33]/90">
          {filteredChannels.length > 0 ? (
            <ul>
              {filteredChannels.map((channel) => (
                <li key={channel.id}>
                  <button
                    className={`w-full flex items-center gap-3 text-left px-6 py-3 transition rounded-none border-l-4 ${activeChannel === channel.id ? "bg-[#2c2f33] border-[#7289da] font-semibold" : "hover:bg-[#36393f]/80 hover:border-[#7289da]/60 hover:font-semibold border-transparent"}`}
                    onClick={() => setActiveChannel(channel.id)}
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
          ) : channelSearch ? (
            <div className="p-6 text-[#b9bbbe]">No channels found</div>
          ) : (
            <div className="p-6 text-[#b9bbbe]">No channels</div>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-[#23272a] via-[#2c2f33] to-[#23272a]">
        {/* Chat header */}
        <header className="px-4 md:px-10 py-4 border-b border-[#36393f] flex items-center justify-between bg-[#23272a]/90 sticky top-0 z-10 shadow-lg backdrop-blur-md rounded-b-xl">
          <div className="flex items-center gap-4">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-[#36393f]/80 transition mr-2"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FiMenu className="text-2xl text-gray-300" />
            </button>
            <FaDiscord className="text-[#7289da] text-2xl" />
            <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow">Discord Stream Console</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ConnectionStatus status={connectionStatus} />
          </div>
        </header>
        <section className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-[#23272a]/80 via-[#2c2f33]/90 to-[#23272a] p-6">
          <div className="flex-1 w-full max-w-4xl mx-auto rounded-2xl shadow-2xl border border-[#36393f] bg-chat-card-gradient overflow-hidden flex flex-col">
            <MessageStream
              isConnected={connectionStatus === "connected"}
              activeChannel={channels.find(c => c.id === activeChannel)}
              messages={messages}
              connectionStatus={connectionStatus}
            />
          </div>
        </section>
      </main>
      {/* Close button for sidebar on mobile */}
      {sidebarOpen && (
        <button
          className="absolute top-4 right-4 z-50 md:hidden p-2 rounded-full hover:bg-[#36393f]/80 transition"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <FiX className="text-2xl text-gray-300" />
        </button>
      )}
    </div>
  )
}
