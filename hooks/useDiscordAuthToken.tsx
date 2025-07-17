'use client'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/useToast"

export default function UseDiscordAuthToken() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    const error = params.get("error")
    if (token) {
      localStorage.setItem("auth_token", token)
      router.replace('/')
    } else if (error) {
      toast({ title: "Login Error", description: error })
      router.replace("/login")
    }
  }, [router,  toast])
  return null
} 