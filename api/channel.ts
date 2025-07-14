import axios from "axios"
import { API_BASE_URL } from "@/api/constant"

class ChannelAPI {
  async getChannels(): Promise<any[]> {
    const res = await axios.get(`${API_BASE_URL}/channels`)
    return res.data
  }
}

export const channelApi = new ChannelAPI()
