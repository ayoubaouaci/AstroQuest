"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function StellarParticles() {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

    useEffect(() => {
        // Generate static particles on mount to avoid hydration mismatch
        const initialParticles = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 5 + 3,
        }));
        setParticles(initialParticles);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0, 1, 0],
                        y: [0, -20, -40], // Float upwards
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 5,
                        ease: "easeInOut",
                    }}
                    className="absolute bg-magic-gold rounded-full shadow-[0_0_5px_var(--magic-gold)]"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                    }}
                />
            ))}
        </div>
    );
}
