import type { DiscordChannel } from "@/types/discord"

export class ChannelManager {
  private channels: DiscordChannel[] = []
  private activeChannelId: string | null = null

  setChannels(channels: DiscordChannel[]): void {
    this.channels = channels
  }

  addChannel(channel: DiscordChannel): void {
    const existingIndex = this.channels.findIndex((c) => c.id === channel.id)
    if (existingIndex >= 0) {
      this.channels[existingIndex] = channel
    } else {
      this.channels.push(channel)
    }
  }

  removeChannel(channelId: string): void {
    this.channels = this.channels.filter((c) => c.id !== channelId)
  }

  getChannels(): DiscordChannel[] {
    return [...this.channels]
  }

  getChannelById(id: string): DiscordChannel | undefined {
    return this.channels.find((c) => c.id === id)
  }

  setActiveChannel(channelId: string): void {
    this.activeChannelId = channelId
  }

  getActiveChannel(): DiscordChannel | null {
    if (!this.activeChannelId) return null
    return this.getChannelById(this.activeChannelId) || null
  }

  getChannelsByServer(serverId: string): DiscordChannel[] {
    return this.channels.filter((c) => c.serverId === serverId)
  }

  updateUnreadCount(channelId: string, count: number): void {
    const channel = this.getChannelById(channelId)
    if (channel) {
      channel.unreadCount = count
    }
  }

  getTotalUnreadCount(): number {
    return this.channels.reduce((total, channel) => total + (channel.unreadCount || 0), 0)
  }
}
