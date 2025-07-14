import axios from "axios"
import { API_BASE_URL } from "@/api/constant"
import type { ApiResponse } from "@/types/api-response"

class MessageAPI {
  async getMessages(channelId: string, limit: number = 50): Promise<any[]> {
    const res = await axios.get<ApiResponse<any[]>>(`${API_BASE_URL}/messages`, { params: { channelId, limit } })
    if (res.data.status === "succeed") {
      return res.data.data || []
    } else {
      throw new Error(res.data.message || "Failed to fetch messages")
    }
  }

  async sendMessage(message: any): Promise<any> {
    const res = await axios.post<ApiResponse<any>>(`${API_BASE_URL}/messages`, message)
    if (res.data.status === "succeed") {
      return res.data.data
    } else {
      throw new Error(res.data.message || "Failed to send message")
    }
  }
}

export const messageApi = new MessageAPI() 