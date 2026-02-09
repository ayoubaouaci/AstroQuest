"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { RenderingEngine } from "@/lib/cosmic-brain/engine-types";

interface NatalChartOverlayProps {
    data: RenderingEngine;
    onComplete?: () => void;
}

export function NatalChartOverlay({ data, onComplete }: NatalChartOverlayProps) {
    const [tasksParams, setTasksParams] = useState<any[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let currentStep = 0;
        const totalDuration = data.animation.duration_ms;
        const stepDelay = Math.max(200, totalDuration / data.draw_sequence.length);

        const interval = setInterval(() => {
            if (currentStep >= data.draw_sequence.length) {
                clearInterval(interval);
                setIsComplete(true);
                onComplete?.();
                return;
            }

            const task = data.draw_sequence[currentStep];
            setTasksParams(prev => [...prev, task]);
            currentStep++;

        }, stepDelay);

        return () => clearInterval(interval);
    }, [data, onComplete]);

    // HELPERS: CENTER (50, 50)
    const getPos = (degree: number, radius: number) => {
        const rad = (degree * Math.PI) / 180;
        return {
            x: 50 + radius * Math.cos(rad),
            y: 50 + radius * Math.sin(rad)
        };
    };

    const getAngleDiff = (a: number, b: number) => {
        const diff = Math.abs(a - b) % 360;
        return diff > 180 ? 360 - diff : diff;
    };



    const PLANET_GLYPHS: Record<string, string> = {
        sun: "☉", moon: "☽", mercury: "☿", venus: "♀", mars: "♂",
        jupiter: "♃", saturn: "♄", uranus: "♅", neptune: "♆", pluto: "♇"
    };

    const ZODIAC_GLYPHS = [
        "♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎", "♎︎", "♏︎", "♐︎", "♑︎", "♒︎", "♓︎"
    ];

    // MASTER TEMPLATE: STABLE ARCHIVE
    // No clustering, clean golden aesthetic
    const adjustedPlanets = tasksParams
        .filter(t => t.task === 'place_planet')
        .map(p => ({ ...p, radius: 36 }));

    const theme = {
        glow: "#FFD700",
        border: "#FFD700",
        bg: "#1a1a0a"
    };

    const rotationOffset = 180 - (data?.ascendant_degree || 0);

    return (
        <div className="relative w-[340px] h-[340px] md:w-[450px] md:h-[450px] flex items-center justify-center">
            {/* Clean border */}
            <div className="absolute inset-[-4px] border border-white/20 rounded-full animate-pulse-slow" />

            {/* ROTATING CONTAINER: ZODIAC & PLANETS */}
            <motion.div
                className="absolute inset-0"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: rotationOffset, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                {/* 1. STATIC OUTER RING: ZODIAC (Radius 40-50%) */}
                {tasksParams.some(t => t.task === 'draw_zodiac_wheel') && (
                    <div className="absolute inset-0 rounded-full border-[1.5rem] md:border-[2rem]"
                        style={{
                            borderColor: `${theme.bg}D0`, // Dark Green solid ring
                            boxShadow: `inset 0 0 20px ${theme.border}`
                        }}
                    >
                        {/* Glyphs on top of the border */}
                        {ZODIAC_GLYPHS.map((glyph, i) => (
                            <div key={`glyph-${i}`} className="absolute inset-0 pointer-events-none">
                                <div
                                    className="absolute inset-0 border-r border-white/10"
                                    style={{ transform: `rotate(${i * 30}deg)` }}
                                />
                                <div
                                    className="absolute top-0 left-1/2 -translate-x-1/2 text-lg md:text-xl font-bold h-full"
                                    style={{
                                        transform: `rotate(${i * 30 + 15}deg)`, // Center of segment
                                        color: theme.glow
                                    }}
                                >
                                    <div className="mt-1 md:mt-2" style={{ transform: `rotate(${-(i * 30 + 15 + rotationOffset)}deg)` }}>
                                        {glyph}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2. PLANET TRACK (Radius 25-40%) */}
                {adjustedPlanets.map((t, i) => {
                    const pos = getPos(t.exact_degree || 0, t.radius); // Vertical Stacking Logic Applied
                    const iconColor = t.id === 'sun' ? '#FFD700' : (t.id === 'moon' ? '#FFFFFF' : theme.glow);

                    return (
                        <motion.div
                            key={`planet-${i}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute flex flex-col items-center justify-center z-20 w-6 h-6"
                            style={{
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                transform: `translate(-50%, -50%) rotate(${-rotationOffset}deg)` // Keep upright
                            }}
                        >
                            <div className="text-lg md:text-xl drop-shadow-[0_0_2px_black]" style={{ color: iconColor }}>
                                {PLANET_GLYPHS[t.id || ''] || '?'}
                            </div>
                        </motion.div>
                    );
                })}


                {/* 3. ASPECT LINES - TRINE ONLY (Cyan) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    {adjustedPlanets.map((p1, i) =>
                        adjustedPlanets.slice(i + 1).map((p2, j) => {
                            const deg1 = p1.exact_degree || 0;
                            const deg2 = p2.exact_degree || 0;
                            const diff = getAngleDiff(deg1, deg2);

                            // Only render Trine (120 deg)
                            if (Math.abs(diff - 120) > 8) return null;

                            const pos1 = getPos(deg1, p1.radius);
                            const pos2 = getPos(deg2, p2.radius);

                            return (
                                <line
                                    key={`trine-${i}-${j}`}
                                    x1={`${pos1.x}%`} y1={`${pos1.y}%`}
                                    x2={`${pos2.x}%`} y2={`${pos2.y}%`}
                                    stroke="#00FFFF"
                                    strokeWidth="1.5"
                                    strokeOpacity="0.8"
                                />
                            )
                        })
                    )}
                </svg>

            </motion.div>

            {/* FIXED AC LINE (Left) */}
            {tasksParams.some(t => t.task === 'set_ascendant') && (
                <div className="absolute top-1/2 left-[5%] w-[45%] h-[1px] bg-white/20 origin-right flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_#FFD700]" />
                </div>
            )}

            {/* FIXED HOUSE GRID (Underlay) */}
            <div className="absolute inset-[15%] rounded-full pointer-events-none opacity-30">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[1px] bg-white/10" style={{ transform: `rotate(${i * 30}deg)` }} />
                    </div>
                ))}
                <div className="absolute bottom-[40%] left-1/2 -translate-x-1/2 text-xs text-white/20">10</div>
            </div>

        </div>
    );
}
