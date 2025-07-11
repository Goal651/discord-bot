import type { DiscordMessage, WebSocketMessage, ConnectionStatus, DiscordChannel } from "@/types/discord"

export class WebSocketManager {
  private ws: WebSocket | null = null
  private url = ""
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private connectionStatusCallback?: (status: ConnectionStatus) => void
  private messageCallback?: (message: DiscordMessage) => void
  private errorCallback?: (error: Event) => void
  private channelsCallback?: (channels: DiscordChannel[]) => void

  connect(url: string): void {
    this.url = url
    this.createConnection()
  }

  private createConnection(): void {
    try {
      this.ws = new WebSocket(this.url)
      this.setupEventListeners()
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error)
      this.handleReconnect()
    }
  }

  private setupEventListeners(): void {
    if (!this.ws) return

    this.ws.onopen = () => {
      console.log("WebSocket connected")
      this.reconnectAttempts = 0
      this.connectionStatusCallback?.("connected")
    }

    this.ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data)
        this.handleMessage(data)
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error)
      }
    }

    this.ws.onclose = () => {
      console.log("WebSocket disconnected")
      this.connectionStatusCallback?.("disconnected")
      this.handleReconnect()
    }

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      this.errorCallback?.(error)
    }
  }

  private handleMessage(data: WebSocketMessage): void {
    switch (data.type) {
      case "new_message":
        this.messageCallback?.(data.payload as DiscordMessage)
        break
      case "channels_update":
        this.channelsCallback?.(data.payload as DiscordChannel[])
        break
      case "connection_status":
        this.connectionStatusCallback?.(data.payload as ConnectionStatus)
        break
      case "error":
        console.error("Server error:", data.payload)
        break
      default:
        console.warn("Unknown message type:", data.type)
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      this.connectionStatusCallback?.("connecting")

      setTimeout(() => {
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
        this.createConnection()
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.error("Max reconnection attempts reached")
      this.connectionStatusCallback?.("disconnected")
    }
  }

  onConnectionChange(callback: (status: ConnectionStatus) => void): void {
    this.connectionStatusCallback = callback
  }

  onMessage(callback: (message: DiscordMessage) => void): void {
    this.messageCallback = callback
  }

  onError(callback: (error: Event) => void): void {
    this.errorCallback = callback
  }

  onChannelsUpdate(callback: (channels: DiscordChannel[]) => void): void {
    this.channelsCallback = callback
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  send(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn("WebSocket is not connected")
    }
  }
}
