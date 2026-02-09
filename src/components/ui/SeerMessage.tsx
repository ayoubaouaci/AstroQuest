"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface SeerMessageProps {
    text: string;
    sender: "seer" | "user";
    timestamp: number;
}

export function SeerMessage({ text, sender, timestamp }: SeerMessageProps) {
    const isSeer = sender === "seer";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex flex-col max-w-[85%] ${isSeer ? 'items-start' : 'items-end'}`}
        >
            <div className={`flex items-end gap-2 ${isSeer ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full border border-white/10 shrink-0 relative overflow-hidden bg-black/50 flex items-center justify-center`}>
                    {isSeer ? (
                        <Image src="/seer-avatar-icon.png" alt="Seer" width={32} height={32} className="object-cover" />
                    ) : (
                        <div className="text-[10px] text-gray-500">YOU</div>
                    )}
                </div>

                {/* Bubble */}
                <div
                    className={`relative px-4 py-2 rounded-2xl text-sm leading-relaxed border ${isSeer
                            ? "bg-black/60 border-purple-500/30 text-purple-100 rounded-bl-none"
                            : "bg-magic-gold/10 border-magic-gold/20 text-yellow-100 rounded-br-none"
                        }`}
                >
                    {isSeer && <div className="absolute -inset-1 bg-purple-500/5 blur-md rounded-2xl -z-10" />}
                    <p>{text}</p>
                </div>
            </div>

            {/* Timestamp */}
            <span className={`text-[10px] text-gray-600 mt-1 px-11 ${isSeer ? 'text-left' : 'text-right'}`}>
                {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </motion.div>
    );
}
