import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from "@/components/auth-context"
import { DiscordAuthEffect } from "@/components/discord-auth-effect"

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <DiscordAuthEffect />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
