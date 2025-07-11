export interface DiscordMessage {
  id: string
  author: string
  authorAvatar?: string
  content: string
  timestamp: string
  channelId: string
  isBot?: boolean
  attachments?: DiscordAttachment[]
}

export interface DiscordAttachment {
  id: string
  name: string
  url: string
  size: number
  contentType?: string
}

export interface WebSocketMessage {
  type: "new_message" | "channels_update" | "connection_status" | "error" | "switch_channel"
  payload: any
}

export type ConnectionStatus = "connecting" | "connected" | "disconnected"

export interface DiscordChannel {
  id: string
  name: string
  type: "text" | "voice"
  serverId: string
  serverName: string
  unreadCount?: number
  isActive?: boolean
}
