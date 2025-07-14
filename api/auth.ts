import axios, { AxiosInstance } from "axios"
import { LOGIN_ENDPOINT, REGISTER_ENDPOINT } from "./constant"

class AuthService {
  private axiosInstance: AxiosInstance
  private token: string | null = null

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  setToken(token: string) {
    this.token = token
    this.axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
  }

  getToken() {
   
    return this.token
  }

  async login(email: string, password: string): Promise<string> {
    const response = await this.axiosInstance.post(LOGIN_ENDPOINT, {email, password })
    const token = response.data.token
    this.setToken(token)
    return token
  }

  async register(username: string, password: string): Promise<string> {
    const response = await this.axiosInstance.post(REGISTER_ENDPOINT, { username, password })
    const token = response.data.token
    this.setToken(token)
    return token
  }

  logout() {
    this.token = null
    delete this.axiosInstance.defaults.headers.common["Authorization"]
  }
}

export const authService = new AuthService() 