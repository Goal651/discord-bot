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
        <svg className="text-5xl text-[#7289da] mb-4" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#7289da"/><path d="M28.5 28c-1.2-1.1-2.3-2-3.3-2.7.3-.1.6-.2.9-.3 2.1-.7 2.9-2.3 2.9-2.3 0-4.8-2.1-8.7-2.1-8.7-2.1-1.6-4.1-1.5-4.1-1.5l-.2.2c2.5.7 3.7 1.8 3.7 1.8-3.2-1.5-6.2-1.5-9.2 0 0 0 1.2-1.1 3.7-1.8l-.2-.2s-2-.1-4.1 1.5c0 0-2.1 3.9-2.1 8.7 0 0 .8 1.6 2.9 2.3.3.1.6.2.9.3-1 .7-2.1 1.6-3.3 2.7 0 0 1.4 1.1 5.2 1.1s5.2-1.1 5.2-1.1zm-7.2-4.7c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3zm6.4 0c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3z" fill="#fff"/></svg>
        <h2 className="text-2xl font-bold mb-6 text-center text-white tracking-tight">
          Login with Discord
        </h2>
        <button
          onClick={handleDiscordLogin}
          className="w-full py-2 rounded-md bg-[#7289da] text-white font-bold shadow hover:bg-[#5b6eae] transition text-lg mt-2 flex items-center justify-center gap-2"
        >
          <svg className="text-2xl mr-2" width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="#7289da"/><path d="M28.5 28c-1.2-1.1-2.3-2-3.3-2.7.3-.1.6-.2.9-.3 2.1-.7 2.9-2.3 2.9-2.3 0-4.8-2.1-8.7-2.1-8.7-2.1-1.6-4.1-1.5-4.1-1.5l-.2.2c2.5.7 3.7 1.8 3.7 1.8-3.2-1.5-6.2-1.5-9.2 0 0 0 1.2-1.1 3.7-1.8l-.2-.2s-2-.1-4.1 1.5c0 0-2.1 3.9-2.1 8.7 0 0 .8 1.6 2.9 2.3.3.1.6.2.9.3-1 .7-2.1 1.6-3.3 2.7 0 0 1.4 1.1 5.2 1.1s5.2-1.1 5.2-1.1zm-7.2-4.7c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3zm6.4 0c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3z" fill="#fff"/></svg> Login with Discord
        </button>
      </div>
    </div>
  );
} 