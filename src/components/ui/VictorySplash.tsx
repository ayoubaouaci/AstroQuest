"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { soundEngine } from "@/lib/sounds";

interface VictorySplashProps {
    isVisible: boolean;
    onComplete: () => void;
    amount?: number;
}

export function VictorySplash({ isVisible, onComplete, amount = 0.5 }: VictorySplashProps) {
    useEffect(() => {
        if (isVisible) {
            soundEngine.playLevelUp(); // Use LevelUp sound for maximum impact
            const timer = setTimeout(() => {
                console.log("Victory modal closed automatically");
                onComplete();
            }, 4000); // 4 seconds duration
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
                    onClick={onComplete}
                >
                    <div className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden">
                        {/* Radiant Background Burst */}
                        <motion.div
                            initial={{ rotate: 0, scale: 0.5, opacity: 0 }}
                            animate={{ rotate: 180, scale: 1.5, opacity: 1 }}
                            transition={{ duration: 4, ease: "easeOut" }}
                            className="absolute w-[600px] h-[600px] bg-gradient-to-r from-transparent via-magic-gold/20 to-transparent blur-3xl opacity-50 pointer-events-none"
                        />

                        {/* Particle Explosion (Simulated with simple divs for MVP) */}
                        {/* In a real engine we'd use a particle system. Here we use CSS animation keyframes defined globaly or simple motion divs */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: 0, y: 0, scale: 0 }}
                                    animate={{
                                        x: (Math.random() - 0.5) * 400,
                                        y: (Math.random() - 0.5) * 400,
                                        scale: Math.random() * 2,
                                        opacity: [1, 0]
                                    }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                    className="absolute w-2 h-2 bg-magic-gold rounded-full shadow-[0_0_10px_#FFD700]"
                                />
                            ))}
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onComplete(); }}
                            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-50 p-2"
                        >
                            <span className="sr-only">Close</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        {/* Main Title */}
                        <motion.div
                            initial={{ scale: 0.5, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 12 }}
                            className="relative z-10 text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-magic-gold to-yellow-600 font-pixel drop-shadow-[0_4px_0_#000] filter">
                                VICTORY
                            </h1>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-6 flex flex-col items-center gap-2"
                            >
                                <div className="bg-black/60 border-2 border-magic-gold px-8 py-4 rounded-full shadow-[0_0_30px_rgba(255,215,0,0.5)] flex items-center gap-4">
                                    <span className="text-4xl animate-pulse">💎</span>
                                    <span className="text-3xl font-pixel text-white tracking-widest">
                                        +{amount.toFixed(1)} SHARDS
                                    </span>
                                </div>
                                <p className="text-magic-gold/80 text-sm font-pixel mt-4 uppercase tracking-[0.3em] animate-pulse">
                                    Milestone Reached
                                </p>
                                <p className="text-white/30 text-xs mt-8 animate-pulse">
                                    Click anywhere to close
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
