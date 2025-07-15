import type { Metadata } from 'next'
import './globals.css'
import { DiscordAuthEffect } from "@/components/discord-auth-effect"
import { SocketProvider } from '@/context/Socket'

export const metadata: Metadata = {
  title: 'CHAT_BOT',
  description: 'Created with Goal',
  generator: 'wigothehacker',
}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SocketProvider>
          <DiscordAuthEffect />
          {children}
        </SocketProvider>
      </body>
    </html>
  )
}
