"use client";

import { motion } from "framer-motion";

export function AscensionEffect() {
    // Generate particles
    const particles = [...Array(40)].map((_, i) => ({
        id: i,
        angle: (i * 360) / 40,
        delay: Math.random() * 0.2,
        size: Math.random() * 4 + 2,
        distance: Math.random() * 300 + 100,
    }));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Flash Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 bg-indigo-500/30 mix-blend-screen"
            />

            {/* Expanding Shockwave */}
            <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="w-[200px] h-[200px] rounded-full border-4 border-cyan-400 blur-sm"
            />

            <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.1, ease: "easeOut" }}
                className="absolute w-[150px] h-[150px] rounded-full border-2 border-magic-gold blur-md"
            />

            {/* Stardust Particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{
                        x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                        y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                        scale: [0, 1.5, 0],
                        opacity: 0,
                    }}
                    transition={{
                        duration: 1.5 + Math.random(),
                        ease: "easeOut",
                        delay: p.delay,
                    }}
                    className={`absolute rounded-full shadow-[0_0_10px_white] ${p.id % 2 === 0 ? "bg-cyan-400" : "bg-magic-gold"
                        }`}
                    style={{
                        width: p.size,
                        height: p.size,
                    }}
                />
            ))}

            {/* Text Announcement */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: [0, 1, 0], scale: 1.2, y: 0 }}
                transition={{ duration: 3, ease: "easeOut" }}
                className="absolute text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magic-gold font-black text-4xl md:text-6xl tracking-[0.5em] uppercase drop-shadow-[0_0_20px_rgba(77,238,234,0.8)]"
            >
                Ascension
            </motion.div>
        </div>
    );
}
