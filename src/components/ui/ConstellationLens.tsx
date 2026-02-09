"use client";

import { motion } from "framer-motion";

interface ConstellationLensProps {
    isUnlocked?: boolean;
}

export function ConstellationLens({ isUnlocked = false }: ConstellationLensProps) {
    return (
        <motion.div
            whileHover={isUnlocked ? { scale: 1.1, rotate: 5 } : {}}
            className={`relative w-32 h-32 md:w-36 md:h-36 group ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-50 grayscale'}`}
        >
            {/* Brass Frame */}
            <div className={`absolute inset-0 rounded-full border-[6px] border-[#b45309] bg-[#78350f]/20 shadow-xl backdrop-blur-[2px] ${!isUnlocked ? 'border-gray-600' : ''}`}>
                {/* Handle stub */}
                <div className={`absolute -bottom-4 -right-4 w-8 h-8 rounded-full -z-10 ${isUnlocked ? 'bg-[#b45309]' : 'bg-gray-600'}`} />
            </div>

            {/* Lens Glass */}
            <div className="absolute inset-2 rounded-full overflow-hidden bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center">
                {/* Constellation SVG - Fades out on hover to show data (only if unlocked) */}
                <svg viewBox="0 0 100 100" className={`w-full h-full opacity-60 transition-opacity duration-500 absolute inset-0 ${isUnlocked ? 'group-hover:opacity-10' : ''}`}>
                    <path d="M20,80 L40,60 L60,40 L80,20" stroke="gold" strokeWidth="0.5" strokeDasharray="2 1" />
                    <circle cx="20" cy="80" r="2" fill="gold" />
                    <circle cx="40" cy="60" r="1.5" fill="gold" />
                    <circle cx="60" cy="40" r="2.5" fill="gold" />
                    <circle cx="80" cy="20" r="3" fill="gold" className={isUnlocked ? "animate-pulse" : ""} />
                    <path d="M40,60 L50,80 L80,20" stroke="gold" strokeWidth="0.5" opacity="0.5" />
                </svg>

                {/* Hidden Archive Data (Reveals on Hover) - Only if unlocked */}
                {isUnlocked ? (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-pixel text-[8px] text-amber-200 text-center leading-tight p-2 drop-shadow-md">
                        <p>SECTOR 7G</p>
                        <p className="text-[6px] opacity-80">ANOMALY DETECTED</p>
                        <p className="mt-1 text-green-300">Runes: 89%</p>
                    </div>
                ) : (
                    <div className="font-pixel text-[8px] text-gray-400 text-center leading-tight p-2">
                        <p className="text-[10px]">🔒</p>
                        <p className="mt-1">LEVEL 5</p>
                        <p className="text-[6px]">REQUIRED</p>
                    </div>
                )}
            </div>

            {/* Reflection Shine */}
            <div className="absolute top-4 left-4 w-8 h-4 bg-white/20 rounded-full rotate-[-45deg] blur-sm pointer-events-none" />
        </motion.div>
    );
}
