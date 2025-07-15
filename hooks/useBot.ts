import { useSocket } from "@/context/Socket"
import { DiscordChannel, DiscordMessage } from "@/types/discord"
import { useEffect, useState } from "react"


export function useBot() {
    const socket = useSocket()
    const [channels, setChannels] = useState<DiscordChannel[]>([])
    const [messages, setMessages] = useState<DiscordMessage[]>([])

    useEffect(() => {
        if (!socket) return
        socket.onChannelsUpdate((data) => {
            setChannels(data)
        })
        socket.onMessage((data) => {
            setMessages((prev) => [...prev, data])
        })

    }, [socket])

    
    return {
        channels,
        messages
    }
}

