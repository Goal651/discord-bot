"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { authService } from "@/api/auth"
import { FaDiscord } from "react-icons/fa"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setToken } = useAuth()
  const [isRegister, setIsRegister] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      // Use AuthService for real backend login
      const token = await authService.login(email, password)
      setToken(token)
      router.push("/")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const token = await authService.register(email, password)
      setToken(token)
      router.push("/")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#23272a] via-[#2c2f33] to-[#23272a]">
      <div className="bg-[#2c2f33]/95 rounded-2xl shadow-2xl p-10 w-full max-w-md border border-[#23272a] flex flex-col items-center">
        <FaDiscord className="text-5xl text-[#7289da] mb-4" />
        <h2 className="text-2xl font-bold mb-6 text-center text-white tracking-tight">
          {isRegister ? "Create an account" : "Welcome back!"}
        </h2>
        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-5 w-full">
          <div>
            <label className="block text-[#b9bbbe] mb-1 text-sm font-semibold">Username</label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-[#23272a] bg-[#36393f] text-white focus:outline-none focus:ring-2 focus:ring-[#7289da] placeholder-[#b9bbbe]"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-[#b9bbbe] mb-1 text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-[#23272a] bg-[#36393f] text-white focus:outline-none focus:ring-2 focus:ring-[#7289da] placeholder-[#b9bbbe]"
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-[#7289da] text-white font-bold shadow hover:bg-[#5b6eae] transition text-lg mt-2"
          >
            {loading ? (isRegister ? "Registering..." : "Logging in...") : (isRegister ? "Register" : "Login")}
          </button>
        </form>
        <div className="mt-6 text-center w-full">
          <button
            type="button"
            onClick={() => setIsRegister(r => !r)}
            className="text-[#7289da] hover:underline bg-transparent border-none text-sm font-semibold"
          >
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  )
} 