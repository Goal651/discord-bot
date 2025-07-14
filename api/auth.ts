import axios, { AxiosInstance } from "axios"
import { LOGIN_ENDPOINT, REGISTER_ENDPOINT } from "./constant"
import type { ApiResponse } from "@/types/api-response";
import { AuthResponse } from "@/types/response";

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
    const response = await this.axiosInstance.post<ApiResponse<AuthResponse>>(LOGIN_ENDPOINT, {email, password });
    console.log(response)
    if (response.data.status === "succeed") {
      const token = response.data.data?.token||'';
      this.setToken(token);
      return token;
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  }

  async register(username: string,email:string, password: string): Promise<string> {
    const response = await this.axiosInstance.post<ApiResponse<AuthResponse>>(REGISTER_ENDPOINT, { username, email,password });
    if (response.data.status === "succeed") {
      const token = response.data.data?.token||'';
      this.setToken(token);
      return token;
    } else {
      throw new Error(response.data.message || "Registration failed");
    }
  }

  logout() {
    this.token = null
    delete this.axiosInstance.defaults.headers.common["Authorization"]
  }
}

export const authService = new AuthService() 