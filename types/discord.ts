export interface DiscordMessage {
  id: string
  author: {
    id: string
    username: string
    displayName?: string
    avatar?: string
    bot?: boolean
  }
  content: string
  timestamp: string
  channelId: string
  serverId?: string
  attachments?: DiscordAttachment[]
  embeds?: DiscordEmbed[]
  reactions?: DiscordReaction[]
  edited?: boolean
  editedTimestamp?: string | null
}

export interface DiscordAttachment {
  id: string
  filename: string
  url: string
  proxyUrl?: string
  size: number
  contentType?: string
  width?: number
  height?: number
}

export interface DiscordEmbed {
  title?: string
  description?: string
  url?: string
  color?: number
  thumbnail?: { url: string }
  image?: { url: string }
  author?: { name: string; iconUrl?: string }
  fields?: { name: string; value: string; inline?: boolean }[]
}

export interface DiscordReaction {
  emoji: { id: string | null; name: string; animated?: boolean }
  count: number
  me: boolean // true if the current user reacted
}

// WebSocketMessage is less relevant with Socket.IO's event-based system,
// but keeping it for conceptual mapping if needed for specific backend payloads.
export interface WebSocketMessage {
  type: string // This will now map to Socket.IO event names like "new_message", "channels_list"
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
  position?: number
  permissions?: {
    canRead: boolean
    canWrite: boolean
    canManage: boolean
  }
}
