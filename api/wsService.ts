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
    private userInfoCallback?: (user: any) => void;

    //For connecting to server
    connect(): void {
        this.token = localStorage.getItem('auth_token')
        if (!this.token) return
        if (this.socket && this.socket.connected) return

        this.socket = io(this.url, {
            transports: ["websocket", "polling"],
            reconnectionAttempts: 10,
            reconnectionDelay: 5000,
            timeout: 20000,
            auth: {
                token: this.token,
            },
        })
        this.setupEventListeners()
        this.connectionStatusCallback?.("connecting")
    }

    //Setter for auth token
    setToken(token: string) {
        this.token = token
        if (this.socket) {
            this.disconnect()
            this.connect()
        }
    }

    //Handle for socket events
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
        this.socket.on("user_info", (user: any) => {
            this.userInfoCallback?.(user);
        });
    }

    //Handle for server connection changes
    onConnectionChange(callback: (status: ConnectionStatus) => void): void {
        this.connectionStatusCallback = callback
    }

    //Handle for receiving new message
    onMessage(callback: (message: DiscordMessage) => void): void {
        this.messageCallback = callback
    }

    //Handle errors
    onError(callback: (error: Error) => void): void {
        this.errorCallback = callback
    }

    //Handle channels update
    onChannelsUpdate(callback: (channels: DiscordChannel[]) => void): void {
        this.channelsCallback = callback
    }

    //Handle user info
    onUserInfo(callback: (user: any) => void): void {
        this.userInfoCallback = callback;
    }

    //Handle disconnecting
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
        }
    }

    //Helper for emitting events to server
    send(event: string, data?: any, callback?: (response: any) => void) {
        if (!this.socket) return
        if (callback) this.socket.emit(event, data, callback)
        else this.socket.emit(event, data)
    }
}

export const websocketService = new WebSocketService() 