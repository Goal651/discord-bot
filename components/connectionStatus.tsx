"use client"

import { Badge } from "@/components/ui/badge"

interface ConnectionStatusProps {
  status: "connecting" | "connected" | "disconnected"
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          variant: "default" as const,
          color: "bg-green-600",
          text: "Connected",
          icon: "🟢",
        }
      case "connecting":
        return {
          variant: "secondary" as const,
          color: "bg-yellow-600",
          text: "Connecting...",
          icon: "🟡",
        }
      case "disconnected":
        return {
          variant: "destructive" as const,
          color: "bg-red-600",
          text: "Disconnected",
          icon: "🔴",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className="flex justify-center">
      <Badge variant={config.variant} className="px-4 py-2">
        <span className="mr-2">{config.icon}</span>
        {config.text}
      </Badge>
    </div>
  )
}
