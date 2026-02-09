"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ShardAnimationProps {
    x: number;
    y: number;
    onComplete: () => void;
}

export function ShardAnimation({ x, y, onComplete }: ShardAnimationProps) {
    const particles = Array.from({ length: 8 });

    return (
        <div
            className="fixed pointer-events-none z-[100]"
            style={{ left: x, top: y }}
        >
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    animate={{
                        scale: 0,
                        opacity: 0,
                        x: (Math.random() - 0.5) * 100,
                        y: (Math.random() - 0.5) * 100,
                        rotate: Math.random() * 360
                    }}
                    onAnimationComplete={i === 0 ? onComplete : undefined}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute w-2 h-2 bg-emerald-400 shadow-[0_0_10px_#10b981]"
                    style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                />
            ))}
        </div>
    );
}
