import { DiscordChannel } from "@/types/discord";
import { FaDiscord } from "react-icons/fa";

interface ChannelListProps {
    channels: DiscordChannel[],
    setActiveChannel: (data: DiscordChannel) => void
    channelSearch: string
    activeChannel: DiscordChannel | null
}

export default function ChannelsList({ channels, setActiveChannel, channelSearch, activeChannel }: ChannelListProps) {

    return (
        <div>
            {channels.length > 0 ? (
                <ul>
                    {channels.map((channel) => (
                        <li key={channel.id}>
                            <button
                                className={`w-full flex items-center gap-3 text-left px-6 py-3 transition rounded-none border-l-4 ${activeChannel?.id === channel.id ? "bg-[#2c2f33] border-[#7289da] font-semibold" : "hover:bg-[#36393f]/80 hover:border-[#7289da]/60 hover:font-semibold border-transparent"}`}
                                onClick={() => setActiveChannel(channel)}
                            >
                                {/* Avatar */}
                                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#23272a] border border-[#36393f] mr-1">
                                    <FaDiscord />
                                </span>
                                {/* Hashtag icon as inline SVG */}
                                <span className="flex items-center">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                        <line x1="4" y1="9" x2="20" y2="9" />
                                        <line x1="4" y1="15" x2="20" y2="15" />
                                        <line x1="10" y1="3" x2="8" y2="21" />
                                        <line x1="16" y1="3" x2="14" y2="21" />
                                    </svg>
                                </span>
                                <span className="truncate">{channel.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : channelSearch ? (
                <div className="p-6 text-[#b9bbbe]">No channels found</div>
            ) : (
                <div className="p-6 text-[#b9bbbe]">No channels</div>
            )}
        </div>
    )
}