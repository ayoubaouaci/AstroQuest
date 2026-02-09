"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { ZODIAC_SIGNS } from "@/lib/zodiac-data";
import Image from "next/image";

interface ZodiacWheelProps {
    targetSignId: string;
    onComplete: () => void;
}

export function ZodiacWheel({ targetSignId, onComplete }: ZodiacWheelProps) {
    const controls = useAnimation();
    const [highlightedSign, setHighlightedSign] = useState<string | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    // Wheel Configuration
    const RADIUS = 300; // Distance from center
    const TOTAL_SIGNS = ZODIAC_SIGNS.length;
    const ANGLE_PER_SIGN = 360 / TOTAL_SIGNS;

    useEffect(() => {
        const spinCeremony = async () => {
            // Find target index
            const targetIndex = ZODIAC_SIGNS.findIndex(z => z.id === targetSignId);

            // We want the target to be at the BOTTOM (90 degrees in typical CSS circle math if 0 is right, but here usually 0 is top).
            // Let's assume standard CSS rotation where 0 is upright.
            // If we rotate the container, we want the target item to end up at rotation 0 (Center Top) or 180 (Center Bottom).
            // The prompt says "Floats forward from circle", typically implying Center.
            // We will rotate so target is at 0 degrees (Top Center).

            // Rotation math:
            // Current Angle of Item I = I * 30.
            // To bring Item I to 0, we rotate container by -(I * 30).
            // Add extra full spins (e.g. 10 * 360).

            const targetRotation = -(targetIndex * ANGLE_PER_SIGN) - (5 * 360);

            // 1. Initial State: Stationary for a moment
            await new Promise(r => setTimeout(r, 1000));

            // 2. Spin Up (Accelerate) -> Spin -> Decelerate
            await controls.start({
                rotate: targetRotation,
                transition: {
                    duration: 8,
                    ease: [0.3, 0, 0.1, 1], // Custom ease for realistic physics
                }
            });

            // 3. Highlight
            setHighlightedSign(targetSignId);
            setIsFinished(true);

            // 4. Wait for highlight animation then verify
            setTimeout(onComplete, 3000);
        };

        spinCeremony();
    }, [controls, targetSignId, onComplete, ANGLE_PER_SIGN]);

    return (
        <div className="relative w-[800px] h-[800px] flex items-center justify-center scale-50 md:scale-75 lg:scale-100 transition-transform duration-1000">

            {/* The Rotating Container */}
            <motion.div
                animate={controls}
                className="relative w-full h-full rounded-full"
                style={{
                    transformOrigin: "center center",
                }}
            >
                {ZODIAC_SIGNS.map((sign, index) => {
                    const angle = index * ANGLE_PER_SIGN;
                    const isTarget = sign.id === targetSignId;
                    const isHighlighted = highlightedSign === sign.id;

                    return (
                        <div
                            key={sign.id}
                            className="absolute top-1/2 left-1/2 w-0 h-0 flex items-center justify-center"
                            style={{
                                transform: `rotate(${angle}deg) translateY(-${RADIUS}px)`,
                            }}
                        >
                            {/* Card Wrapper - Counter-rotated to stay upright if desired, 
                                but usually wheel cards rotate with wheel. 
                                Let's keep them rotated with wheel for "Wheel of Fortune" feel.
                            */}
                            <motion.div
                                className={`
                                    relative w-[100px] h-[150px]
                                    rounded-lg border-2 
                                    flex flex-col items-center justify-center
                                    transition-all duration-1000
                                    ${isHighlighted ? "z-50" : "opacity-80"}
                                `}
                                style={{
                                    // Make target float out and dissolve wheel rotation effects roughly
                                    // Actually, if we rotate the whole container, the target will be at 0deg (Top).
                                    // So it will be upright.
                                    transformOrigin: "center center"
                                }}
                                animate={isHighlighted ? {
                                    scale: 2.5,
                                    y: 150, // Move down towards absolute center
                                    boxShadow: "0 0 50px #ffd700",
                                    borderColor: "#ffd700",
                                    backgroundColor: "#1a0b2e",
                                    opacity: 1
                                } : {
                                    scale: isFinished ? 0.8 : 1,
                                    opacity: isFinished ? 0.3 : 1,
                                    borderColor: "rgba(255,255,255,0.2)",
                                    backgroundColor: "rgba(0,0,0,0.8)"
                                }}
                            >
                                {/* Card Graphic */}
                                <div className="absolute inset-0 rounded-lg overflow-hidden">
                                    {/* Placeholder Image or Gradient */}
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-1">
                                        <div className="relative w-full h-full bg-black/50 overflow-hidden">
                                            <Image
                                                src={sign.image}
                                                alt={sign.name}
                                                fill
                                                className="object-cover opacity-80"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Symbol & Name */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-yellow-200 to-yellow-600 drop-shadow-md">
                                        {sign.symbol}
                                    </span>
                                    {isHighlighted && (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-[8px] uppercase tracking-widest text-[#ffd700] mt-2 font-serif"
                                        >
                                            {sign.name}
                                        </motion.span>
                                    )}
                                </div>

                                {/* Highlight Particles */}
                                {isHighlighted && (
                                    <>
                                        <motion.div
                                            className="absolute -inset-4 rounded-xl border border-yellow-400/30"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        <motion.div
                                            className="absolute -inset-8 rounded-xl border border-yellow-200/10"
                                            animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                        />
                                    </>
                                )}
                            </motion.div>
                        </div>
                    );
                })}
            </motion.div>

            {/* Center Decoration */}
            {!isFinished && (
                <div className="absolute w-4 h-4 rounded-full bg-white/20 blur-sm z-0" />
            )}
        </div>
    );
}
