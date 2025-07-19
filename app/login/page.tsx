"use client"

import { FaDiscord } from "react-icons/fa"
import { BASE_URL, END_POINT } from "@/api/constant"
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#23272a] via-[#2c2f33] to-[#23272a]">
      <div className="bg-[#2c2f33]/95 rounded-2xl shadow-2xl p-10 w-full max-w-md border border-[#23272a] flex flex-col items-center">
        <FaDiscord size={62} color="white" className="mb-5" />
        <h2 className="text-2xl font-bold mb-6 text-center text-white tracking-tight">
          Welcome To Echo Bot
        </h2>
        <Link
          href={`${BASE_URL.API}${END_POINT.AUTH.LOGIN}`}
          className="w-full py-2 rounded-md bg-[#7289da] text-white font-bold shadow hover:bg-[#5b6eae] transition text-lg mt-2 flex items-center justify-center gap-2"
        >
          <FaDiscord />Login with Discord
        </Link>
      </div>
    </div>
  );
} 