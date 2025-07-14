"use client"

import { useDiscordAuthToken } from "@/hooks/use-discord-auth-token"

export function DiscordAuthEffect() {
  useDiscordAuthToken()
  return null
} 