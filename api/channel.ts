import axios from "axios"
import { API_BASE_URL } from "@/api/constant"
import type { ApiResponse } from "@/types/api-response"

class ChannelAPI {
    async getChannels(): Promise<any[]> {
        const res = await axios.get<ApiResponse<any[]>>(`${API_BASE_URL}/discord/channels`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        })
        if (res.data.status === "succeed") {
            return res.data.data || []
        } else {
            throw new Error(res.data.message || "Failed to fetch channels")
        }
    }

    async addChannel(channel: { name: string }): Promise<any> {
        const res = await axios.post<ApiResponse<any>>(`${API_BASE_URL}/channels`, channel)
        if (res.data.status === "succeed") {
            return res.data.data
        } else {
            throw new Error(res.data.message || "Failed to add channel")
        }
    }

    async addChannelByDiscordId(discordChannelId: string): Promise<any> {
        const res = await axios.post<ApiResponse<any>>(
            `${API_BASE_URL}/users/channels`,
            { discordChannelId },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                },
            }
        )
        if (res.data.status === "succeed") {
            return res.data.data
        } else {
            throw new Error(res.data.message || "Failed to add channel")
        }
    }

    async getAvailableDiscordChannels(): Promise<any[]> {
        const res = await axios.get<ApiResponse<any[]>>(`${API_BASE_URL}/discord/channels`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        })
        if (res.data.status === "succeed") {
            return res.data.data || []
        } else {
            throw new Error(res.data.message || "Failed to fetch Discord channels")
        }
    }
}

export const channelApi = new ChannelAPI()
