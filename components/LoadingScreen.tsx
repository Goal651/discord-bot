import React from "react";
import { FaDiscord } from "react-icons/fa";

export default function LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#313338] text-white">
            {/* Discord SVG Icon */}
            <FaDiscord size={68} color="white"/>
            <h1 className="text-2xl font-bold mb-2">Loading Discord Bot...</h1>
            <div className="flex space-x-1 mt-2">
                <span className="animate-bounce [animation-delay:-0.32s]">.</span>
                <span className="animate-bounce [animation-delay:-0.16s]">.</span>
                <span className="animate-bounce">.</span>
            </div>
        </div>
    );
} 