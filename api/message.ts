import axios from "axios"
import { API_BASE_URL } from "@/api/constant"

class MessageAPI {
  async getMessages(channelId: string, limit: number = 50): Promise<any[]> {
    const res = await axios.get(`${API_BASE_URL}/messages`, { params: { channelId, limit } })
    return res.data
  }

  async sendMessage(message: any): Promise<any> {
    const res = await axios.post(`${API_BASE_URL}/messages`, message)
    return res.data
  }
}

export const messageApi = new MessageAPI() 