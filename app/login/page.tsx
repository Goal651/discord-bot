"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { FaDiscord } from "react-icons/fa"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      router.replace("/")
    }
  }, [router])

  const handleDiscordLogin = () => {
    window.location.href = `http://localhost:3001/api/auth/discord/login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#23272a] via-[#2c2f33] to-[#23272a]">
      <div className="bg-[#2c2f33]/95 rounded-2xl shadow-2xl p-10 w-full max-w-md border border-[#23272a] flex flex-col items-center">
        <FaDiscord className="text-5xl text-[#7289da] mb-4" />
        <h2 className="text-2xl font-bold mb-6 text-center text-white tracking-tight">
          Login with Discord
        </h2>
        <button
          onClick={handleDiscordLogin}
          className="w-full py-2 rounded-md bg-[#7289da] text-white font-bold shadow hover:bg-[#5b6eae] transition text-lg mt-2 flex items-center justify-center gap-2"
        >
          <FaDiscord className="text-2xl mr-2" /> Login with Discord
        </button>
      </div>
    </div>
  );
} 