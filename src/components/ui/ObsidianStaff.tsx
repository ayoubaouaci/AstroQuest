"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { StellarParticles } from "./StellarParticles";

interface ObsidianStaffProps {
    xp: number;
    level: number;
}

export function ObsidianStaff({ xp, level }: ObsidianStaffProps) {
    return (
        <div className="relative h-full w-full pointer-events-none z-20 hidden lg:flex flex-col items-center justify-center">
            {/* Staff Container */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative h-full w-full"
            >
                <div className="absolute inset-0 flex items-center justify-center animate-divine-float">
                    <Image
                        src="/obsidian-staff.png"
                        alt="Obsidian Quarterstaff"
                        fill
                        className="object-contain drop-shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                        style={{ imageRendering: "pixelated" }}
                    />
                </div>

                {/* Rune Glow Effect based on Level */}
                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-purple-500/20 blur-xl mix-blend-overlay rounded-full"
                />

                {/* Staff Particles */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <StellarParticles />
                </div>

                {/* Level Tag */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/80 border border-purple-500/50 px-3 py-1 rounded text-[10px] uppercase font-pixel text-purple-300 whitespace-nowrap">
                    Lvl {level} Staff
                </div>
            </motion.div>
        </div>
    );
}
