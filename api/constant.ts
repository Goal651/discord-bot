// API and server endpoints

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001/discord"

// Example endpoints
export const LOGIN_ENDPOINT = "/auth/login"
export const REGISTER_ENDPOINT = "/auth/register"
// Add more endpoints as needed 