import { useSocket } from "@/context/Socket"
import { ConnectionStatus, DiscordChannel, DiscordMessage } from "@/types/discord"
import { useEffect, useState } from "react"


export function useBot({ activeChannel }: { activeChannel: string | null }) {
    const socket = useSocket()
    const [channels, setChannels] = useState<DiscordChannel[]>([])
    const [messages, setMessages] = useState<DiscordMessage[]>([])
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting")
    

    useEffect(() => {
        if (!socket) return
        socket.onChannelsUpdate((data) => {
            setChannels(data)
        })
        socket.onMessage((data) => {
            setMessages((prev) => [...prev, data])
        })
        socket.onConnectionChange((data) => {
            setConnectionStatus(data)
        })

    }, [socket])

    useEffect(() => {
        setMessages([])
    }, [activeChannel])


    return {
        channels,
        messages,
        connectionStatus
    }
}

