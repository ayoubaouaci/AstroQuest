import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { DangerLevel } from "@/lib/planets";

interface CosmicRadarProps {
    foundSignals?: number;
    hasActiveQuests?: boolean;
    onVoidStrike?: () => void;
    onVoidPurge?: () => void;
    dangerLevel?: DangerLevel;
}



export function CosmicRadar({ foundSignals = 0, hasActiveQuests = false, onVoidStrike, onVoidPurge, dangerLevel = 'safe' }: CosmicRadarProps) {
    const requestRef = useRef<number>();

    // No Void Entity Logic in this version


    return (
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
            {/* Radar Frame */}
            <div className={`absolute inset-0 rounded-full border-4 border-[#3e2723] bg-black shadow-[0_0_20px_rgba(0,0,0,0.8)] box-border transition-all duration-500 ${hasActiveQuests ? 'animate-pulse shadow-[0_0_30px_rgba(34,197,94,0.6)]' : ''}`}>
                <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#5d4037] animate-spin-slow opacity-80" />
            </div>

            {/* Radar Grid */}
            <div className="absolute inset-2 rounded-full border border-green-900/50 bg-[radial-gradient(circle,_rgba(20,83,45,0.2)_1px,_transparent_1px)] bg-[length:10px_10px] overflow-hidden">
                <div className="absolute inset-0 border rounded-full border-green-500/20 scale-50" />
                <div className="absolute inset-0 border rounded-full border-green-500/20 scale-75" />
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-green-500/20" />
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-green-500/20" />


            </div>

            {/* Radar Sweep */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full overflow-hidden pointer-events-none"
            >
                <div className="w-full h-full bg-[conic-gradient(from_0deg,_transparent_0deg,_transparent_270deg,_rgba(34,197,94,0.5)_360deg)] opacity-60" />
            </motion.div>

            {/* Signal Blips */}
            {foundSignals > 0 && (
                <>
                    <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-1/3 left-1/3 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_5px_#4ade80]"
                    />
                    {foundSignals > 1 && (
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                            className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_5px_#facc15]"
                        />
                    )}
                </>
            )}

            {/* Glass Reflection */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        </div>
    );
}
