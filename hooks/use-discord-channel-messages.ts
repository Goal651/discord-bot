import { useEffect, useState, useRef } from "react"
import { websocketService } from "@/api/websocket-service"
import { messageApi } from "@/api/message"
import { useAuth } from "@/components/auth-context"
import type { DiscordMessage } from "@/types/discord"

export function useDiscordChannelMessages(channelId: string | null) {
  const { token } = useAuth()
  const [messages, setMessages] = useState<DiscordMessage[]>([])
  const socketInitialized = useRef(false)

  useEffect(() => {
    if (!token || !channelId) return

    // Fetch initial messages
    messageApi.getMessages(channelId).then(setMessages)

    // Connect to Socket.IO and join channel
    if (!socketInitialized.current) {
      websocketService.connect(undefined, token)
      socketInitialized.current = true
    }
    websocketService.send("join_channel", { channelId })

    // Listen for new messages
    const handleMessage = (msg: DiscordMessage) => {
      setMessages((prev) => [...prev, msg])
    }
    websocketService.onMessage(handleMessage)

    return () => {
      websocketService.send("leave_channel", { channelId })
      websocketService.onMessage(() => {}) // Remove listener
      // Optionally disconnect if needed: websocketService.disconnect()
    }
    // eslint-disable-next-line
  }, [token, channelId])

  return messages
} 