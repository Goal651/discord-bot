export type ApiStatus = "succeed" | "failed"

export interface ApiResponse<T = any> {
  status: ApiStatus
  data?: T
  message?: string
} 