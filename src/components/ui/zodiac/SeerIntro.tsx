"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface SeerIntroProps {
    onAwaken: () => void;
}

export function SeerIntro({ onAwaken }: SeerIntroProps) {
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/50 via-[#0a0a2a] to-[#050510]" />

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: Math.random() * 0.5 + 0.1,
                            scale: Math.random() * 0.5 + 0.5
                        }}
                        animate={{
                            y: [null, Math.random() * -100],
                            opacity: [null, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute w-1 h-1 bg-purple-400 rounded-full blur-[1px]"
                    />
                ))}
            </div>

            {/* The Seer Figure */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* Hooded Figure Representation */}
                <div className="relative w-48 h-48 md:w-72 md:h-72 mb-10">
                    <div className="absolute inset-0 bg-indigo-900 rounded-full blur-3xl opacity-30 animate-pulse" />

                    {/* Seer Image Placeholder / CSS Art */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Hood Shape */}
                        <div className="absolute top-0 w-32 h-32 bg-gradient-to-b from-[#1a0b2e] to-transparent rounded-t-full z-10" />
                        <div className="absolute top-8 w-40 h-40 bg-gradient-to-b from-[#2e1065] to-[#0f0718] rounded-full blur-md" />

                        {/* Glowing Eyes */}
                        <div className="absolute top-20 flex gap-8 z-20">
                            <motion.div
                                animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="w-3 h-1 bg-purple-300 rounded-full shadow-[0_0_15px_#d8b4fe]"
                            />
                            <motion.div
                                animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="w-3 h-1 bg-purple-300 rounded-full shadow-[0_0_15px_#d8b4fe]"
                            />
                        </div>

                        {/* Crystal Ball */}
                        <div className="absolute bottom-0 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-900/80 via-indigo-500/20 to-cyan-400/30 backdrop-blur-sm border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center overflow-hidden z-30">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-[200%] h-[200%] bg-[url('/noise.png')] opacity-20 mix-blend-overlay"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>
                    </div>
                </div>

                {/* Text Overlay */}
                <div className="text-center space-y-4 mb-12">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="text-purple-300 font-pixel text-xs tracking-[0.2em] uppercase"
                    >
                        The Veiled Novice
                    </motion.h2>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-white to-purple-200 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                    >
                        THE SEER HAS AWAKENED
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ delay: 2.5, duration: 1 }}
                        className="text-purple-200/60 font-serif italic text-lg md:text-xl max-w-md mx-auto"
                    >
                        "I have awakened to serve you, Master"
                    </motion.p>
                </div>

                {/* Awaken Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.5, duration: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAwaken}
                    className="group relative px-12 py-4 bg-[#1a0b2e] border border-purple-500 rounded-none overflow-hidden"
                >
                    <motion.div
                        className="absolute inset-0 bg-purple-600/30 blur-xl"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    <span className="relative z-10 flex items-center gap-3 text-purple-100 font-serif tracking-[0.2em] text-lg uppercase shadow-black drop-shadow-md">
                        <Sparkles className="w-5 h-5 text-purple-300" />
                        Awaken
                        <Sparkles className="w-5 h-5 text-purple-300" />
                    </span>

                    <div className="absolute inset-0 border border-purple-400/50 rounded-none shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] transition-shadow duration-300" />
                </motion.button>
            </motion.div>
        </div>
    );
}
