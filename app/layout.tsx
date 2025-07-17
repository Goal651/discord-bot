import { Metadata } from 'next'
import './globals.css'
import { SocketProvider } from '@/context/Socket'
import UseDiscordAuthToken from '@/hooks/useDiscordAuthToken'

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
          <UseDiscordAuthToken />
          {children}
        </SocketProvider>
      </body>
    </html>
  )
}
