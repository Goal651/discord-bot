import axios, { AxiosInstance } from "axios"
import type { ApiResponse } from "@/types/api-response";
import { AuthResponse } from "@/types/response";
import { BASE_URL, END_POINT } from "./constant";

class AuthService {
  private axiosInstance: AxiosInstance
  private token: string | null = null

  constructor() {
    this.axiosInstance = axios.create({
      baseURL:BASE_URL.API ,
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
    const response = await this.axiosInstance.post<ApiResponse<AuthResponse>>(END_POINT.AUTH.LOGIN, { email, password });
    console.log(response)
    if (response.data.status === "succeed") {
      const token = response.data.data?.token || '';
      this.setToken(token);
      return token;
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  }


  logout() {
    this.token = null
    delete this.axiosInstance.defaults.headers.common["Authorization"]
  }
}

export const authService = new AuthService() 