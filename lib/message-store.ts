import type { DiscordMessage } from "@/types/discord"

export class MessageStore {
  private messages: DiscordMessage[] = []
  private maxMessages = 100

  addMessage(message: DiscordMessage): void {
    // Prevent duplicate messages
    if (this.messages.some((m) => m.id === message.id)) {
      return
    }

    this.messages.push(message)

    // Keep only the latest messages
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages)
    }
  }

  getMessages(): DiscordMessage[] {
    return [...this.messages]
  }

  getMessageById(id: string): DiscordMessage | undefined {
    return this.messages.find((m) => m.id === id)
  }

  clearMessages(): void {
    this.messages = []
  }

  getMessageCount(): number {
    return this.messages.length
  }

  getMessagesByAuthor(author: string): DiscordMessage[] {
    return this.messages.filter((m) => m.author === author)
  }
}
