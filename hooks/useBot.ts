import { WS_ENDPOINTS } from "@/api/constant";
import { useSocket } from "@/context/SocketContext"
import { ConnectionStatus, DiscordChannel, DiscordMessage, DiscordUser } from "@/types/discord"
import { useEffect, useState } from "react"


export function useBot() {
    const socket = useSocket()
    const [channelSearch, setChannelSearch] = useState('');
    const [activeChannel, setActiveChannel] = useState('')
    const [channels, setChannels] = useState<DiscordChannel[]>([])
    const [messages, setMessages] = useState<DiscordMessage[]>([])
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting")
    const [userInfo, setUserInfo] = useState<DiscordUser | null>(null)


    useEffect(() => {
        if (!socket) return
        socket.onChannelsUpdate((data) => {
            if (Array.isArray(data)) setChannels(data)
            else if (data && typeof data === "object") setChannels([data])
            else setChannels([])
        })
        socket.onMessage((data) => setMessages((prev) => [...prev, data]))
        socket.onConnectionChange((data) => setConnectionStatus(data))
        socket.onUserInfo((data) => setUserInfo(data))
    }, [socket])

    useEffect(() => {
        if (!socket) return
        if (activeChannel) socket.send(WS_ENDPOINTS.CHANNELS.LEAVE, { channelId: activeChannel })
        socket.send(WS_ENDPOINTS.CHANNELS.JOIN, { channelId: activeChannel })
        setMessages([])
    }, [activeChannel])

    const filteredChannels = channels.filter(channel => {
        if (!channelSearch) return channel
        return channel.name.toLowerCase().includes(channelSearch.toLowerCase())
    });

    return {
        channels,
        messages,
        connectionStatus,
        activeChannel,
        setActiveChannel,
        channelSearch,
        setChannelSearch,
        filteredChannels,
        userInfo
    }
}

