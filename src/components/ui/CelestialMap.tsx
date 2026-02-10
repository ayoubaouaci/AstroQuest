"use client";

import { motion } from "framer-motion";
import { RenderingEngine, AstrologicalEngine } from "@/lib/cosmic-brain/engine-types";
import { useEffect, useState } from "react";

interface CelestialMapProps {
    engineData?: RenderingEngine | AstrologicalEngine;
    className?: string;
}

export function CelestialMap({ engineData, className = "" }: CelestialMapProps) {
    const [rotation, setRotation] = useState(0);

    // animate rotation slowly
    useEffect(() => {
        const interval = setInterval(() => {
            setRotation(r => (r + 0.1) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    // Premium "Fakhma" Theme Colors
    const GOLD_GRADIENT = "linear-gradient(135deg, #FFD700 0%, #B8860B 50%, #FFD700 100%)";
    const BRONZE_GRADIENT = "conic-gradient(from 0deg, #cd7f32, #8b4513, #cd7f32)";

    return (
        <div className={`relative w-[340px] h-[340px] md:w-[500px] md:h-[500px] flex items-center justify-center ${className}`}>

            {/* 1. OUTER GLOW PULSE (Atmosphere) */}
            <div className="absolute inset-4 rounded-full bg-magic-gold/5 blur-3xl animate-pulse-slow pointer-events-none" />

            {/* 2. BASE PLATFORM (Metallic Disc) */}
            <div className="absolute inset-0 rounded-full border-[1px] border-magic-gold/20 bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(184,134,11,0.2)]">
                {/* Dither Texture Overlay (Pixel Art Feel) */}
                <div className="absolute inset-0 rounded-full opacity-20 bg-[url('/noise.png')] mix-blend-overlay" />
            </div>

            {/* 3. ROTATING ZODIAC RING (Heavy Gold) */}
            <motion.div
                className="absolute inset-[10%] rounded-full border-[8px] md:border-[12px] border-double"
                style={{
                    borderColor: '#B8860B', // Dark Goldenrod fallback
                    borderImage: `${BRONZE_GRADIENT} 1`
                }}
                animate={{ rotate: rotation }}
                transition={{ duration: 60, ease: "linear", repeat: Infinity }}
            >
                {/* Decorative Ticks */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 md:h-4 bg-magic-gold shadow-[0_0_5px_#FFD700]"
                        style={{ transform: `rotate(${i * 30}deg) translateY(-50%)`, transformOrigin: "50% 50% 150px" }} // Approximate origin
                    />
                ))}
            </motion.div>

            {/* 4. INNER CALIBRATION RING (Technical) */}
            <motion.div
                className="absolute inset-[25%] rounded-full border border-dashed border-cyan-400/30"
                animate={{ rotate: -rotation * 1.5 }}
            >
                {/* 4 Cardinal Points */}
                {[0, 90, 180, 270].map((deg) => (
                    <div
                        key={deg}
                        className="absolute top-1/2 left-1/2 w-[120%] h-[1px] bg-cyan-400/20"
                        style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
                    />
                ))}
            </motion.div>

            {/* 5. CENTER CRYSTAL (Focal Point) */}
            <div className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-900 to-black border-2 border-magic-gold shadow-[0_0_20px_rgba(75,0,130,0.6)] flex items-center justify-center z-10">
                <div className="text-4xl animate-pulse">
                    ✨
                </div>
                {/* Orbiting Particles */}
                <motion.div
                    className="absolute w-full h-full rounded-full border border-white/10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_5px_#00FFFF]" />
                </motion.div>
            </div>

            {/* 6. LABELING (Premium Text) */}
            <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 text-center">
                <p className="text-magic-gold text-xs font-pixel uppercase tracking-[0.3em] drop-shadow-md">
                    Celestial Engine
                </p>
                <div className="w-12 h-[1px] bg-magic-gold mx-auto mt-1" />
            </div>

        </div>
    );
}
