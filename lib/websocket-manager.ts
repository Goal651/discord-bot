import { io, type Socket } from "socket.io-client"
import type { DiscordMessage, ConnectionStatus, DiscordChannel } from "@/types/discord"

export class WebSocketManager {
  private socket: Socket | null = null
  private url: string
  private connectionStatusCallback?: (status: ConnectionStatus) => void
  private messageCallback?: (message: DiscordMessage) => void
  private errorCallback?: (error: Error) => void
  private channelsCallback?: (channels: DiscordChannel[]) => void

  constructor() {
    this.url = "http://localhost:3001/discord" // Default Socket.IO namespace
  }

  connect(url?: string): void {
    if (url) {
      this.url = url
    }

    if (this.socket && this.socket.connected) {
      console.log("Socket.IO already connected.")
      return
    }

    this.socket = io(this.url, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      auth: {
        token: "your_auth_token_here", // Replace with actual authentication token
      },
    })

    this.setupEventListeners()
    this.connectionStatusCallback?.("connecting")
  }

  private setupEventListeners(): void {
    if (!this.socket) return

    this.socket.on("connect", () => {
      console.log("Socket.IO connected")
      this.connectionStatusCallback?.("connected")
    })

    this.socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason)
      this.connectionStatusCallback?.("disconnected")
    })

    this.socket.on("connect_error", (error: Error) => {
      console.error("Socket.IO connection error:", error)
      this.errorCallback?.(error)
      this.connectionStatusCallback?.("disconnected")
    })

    this.socket.on("error", (error: any) => {
      console.error("Socket.IO server error:", error)
      this.errorCallback?.(new Error(error.message || "Unknown server error"))
    })

    // Custom events from the backend
    this.socket.on("message", (message: DiscordMessage) => {
      this.messageCallback?.(message)
    })

    this.socket.on("channels_list", (channels: DiscordChannel[]) => {
      this.channelsCallback?.(channels)
    })

    this.socket.on("connection_status", (status: ConnectionStatus) => {
      this.connectionStatusCallback?.(status)
    })

    this.socket.on("rate_limited", (data: { message: string; retryAfter: number }) => {
      console.warn("Rate limited:", data.message, "Retry after:", data.retryAfter)
      this.errorCallback?.(new Error(`Rate limited: ${data.message}`))
    })

    this.socket.on("user_joined", (data: { channelId: string; user: { id: string; username: string } }) => {
      console.log(`User ${data.user.username} joined channel ${data.channelId}`)
      // You might want to update a user presence store here
    })

    this.socket.on("user_left", (data: { channelId: string; user: { id: string; username: string } }) => {
      console.log(`User ${data.user.username} left channel ${data.channelId}`)
      // You might want to update a user presence store here
    })

    this.socket.on("typing_start", (data: { channelId: string; userId: string; username: string }) => {
      console.log(`${data.username} is typing in ${data.channelId}`)
      // Update typing indicators
    })

    this.socket.on("typing_stop", (data: { channelId: string; userId: string }) => {
      console.log(`${data.userId} stopped typing in ${data.channelId}`)
      // Clear typing indicators
    })
  }

  onConnectionChange(callback: (status: ConnectionStatus) => void): void {
    this.connectionStatusCallback = callback
  }

  onMessage(callback: (message: DiscordMessage) => void): void {
    this.messageCallback = callback
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallback = callback
  }

  onChannelsUpdate(callback: (channels: DiscordChannel[]) => void): void {
    this.channelsCallback = callback
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Emit events to the server
  send(eventName: string, payload: any, callback?: (response: any) => void): void {
    if (this.socket && this.socket.connected) {
      if (callback) {
        this.socket.emit(eventName, payload, callback)
      } else {
        this.socket.emit(eventName, payload)
      }
    } else {
      console.warn(`Socket.IO is not connected. Cannot emit event: ${eventName}`)
      if (callback) {
        callback({ success: false, error: "Socket not connected" })
      }
    }
  }
}
