import { Metadata } from 'next'
import './globals.css'
import { SocketProvider } from '@/context/SocketContext'
import UseDiscordAuthToken from '@/hooks/useDiscordAuthToken'

export const metadata: Metadata = {
  title: 'Echo Discord Bot',
  description: 'Created by Goal',
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
