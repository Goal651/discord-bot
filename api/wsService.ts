import { io, type Socket } from "socket.io-client"
import type { DiscordMessage, ConnectionStatus, DiscordChannel } from "@/types/discord"
import { BASE_URL, WS_ENDPOINTS } from "./constant"

class WebSocketService {
    private socket: Socket | null = null
    private url: string = BASE_URL.WS
    private connectionStatusCallback?: (status: ConnectionStatus) => void
    private messageCallback?: (message: DiscordMessage) => void
    private errorCallback?: (error: Error) => void
    private channelsCallback?: (channels: DiscordChannel[]) => void
    private token: string | null = null

    connect(): void {
        // Use provided token or fallback to AuthService's token
        this.token = localStorage.getItem('auth_token')
        if (!this.token) return
        if (this.socket && this.socket.connected) {
            return
        }
        this.socket = io(this.url, {
            transports: ["websocket", "polling"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000,
            auth: {
                token: this.token,
            },
        })
        this.setupEventListeners()
        this.connectionStatusCallback?.("connecting")
    }

    setToken(token: string) {
        this.token = token
        if (this.socket) {
            this.disconnect()
            this.connect()
        }
    }

    private setupEventListeners(): void {
        if (!this.socket) return

        this.socket.on(WS_ENDPOINTS.CONNECTION.CONNECT, () => {
            this.connectionStatusCallback?.("connected")
        })
        this.socket.on(WS_ENDPOINTS.CONNECTION.DISCONNECT, (reason) => {
            this.connectionStatusCallback?.("disconnected")
        })
        this.socket.on(WS_ENDPOINTS.ERROR.CONNECTION, (error: Error) => {
            console.error("Socket.IO connection error:", error)
            this.errorCallback?.(error)
            this.connectionStatusCallback?.("disconnected")
        })
        this.socket.on(WS_ENDPOINTS.ERROR.GLOBAL, (error: any) => {
            console.error("Socket.IO server error:", error)
            this.errorCallback?.(new Error(error.message || "Unknown server error"))
        })
        this.socket.on(WS_ENDPOINTS.MESSAGE.NEW, (message: DiscordMessage) => {
            this.messageCallback?.(message)
        })
        this.socket.on(WS_ENDPOINTS.CHANNELS.LIST, (channels: DiscordChannel[]) => {
            console.log(channels)
            this.channelsCallback?.(channels)
        })
        this.socket.on(WS_ENDPOINTS.CONNECTION.STATUS, (status: ConnectionStatus) => {
            this.connectionStatusCallback?.(status)
        })
        this.socket.on("rate_limited", (data: { message: string; retryAfter: number }) => {
            console.warn("Rate limited:", data.message, "Retry after:", data.retryAfter)
            this.errorCallback?.(new Error(`Rate limited: ${data.message}`))
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

    send(event: string, data?: any, callback?: (response: any) => void) {
        if (!this.socket) return
        if (callback) {
            this.socket.emit(event, data, callback)
        } else {
            this.socket.emit(event, data)
        }
    }
}

export const websocketService = new WebSocketService() 