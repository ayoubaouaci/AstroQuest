"use client";

import { motion } from "framer-motion";

interface ShardMeterProps {
    shards: number;
}

export function ShardMeter({ shards }: ShardMeterProps) {
    // Determine fill level (cap visual at 10 shards for now)
    const fillPercent = Math.min((shards / 10) * 100, 100);

    return (
        <div className="relative w-16 h-32 flex flex-col items-center justify-end">
            {/* Glass Jar Container */}
            <div className="w-12 h-24 border-2 border-[#a855f7]/50 bg-black/40 rounded-t-full rounded-b-lg relative overflow-hidden backdrop-blur-sm">

                {/* Liquid Fill */}
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${fillPercent}%` }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 via-purple-600 to-purple-400 opacity-80"
                >
                    {/* Bubbles */}
                    <motion.div
                        animate={{ y: [0, -40] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-1/2 w-1 h-1 bg-white/50 rounded-full"
                    />
                    <motion.div
                        animate={{ y: [0, -60] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.5 }}
                        className="absolute bottom-0 left-1/4 w-1 h-1 bg-white/50 rounded-full"
                    />
                </motion.div>

                {/* Glint */}
                <div className="absolute top-2 right-2 w-1 h-8 bg-white/20 rounded-full rotate-12" />
            </div>

            {/* Pedestal */}
            <div className="w-16 h-4 bg-[#3e2723] rounded-sm border-t border-[#5d4037] shadow-lg flex items-center justify-center">
                <span className="text-[8px] font-pixel text-[#e0f2fe]">{shards.toFixed(1)}</span>
            </div>

            <div className="absolute -bottom-6 font-pixel text-[8px] text-purple-300 tracking-wider">
                RESONANCE
            </div>
        </div>
    );
}
