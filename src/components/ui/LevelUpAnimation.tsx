"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star } from "lucide-react";

interface LevelUpAnimationProps {
    show: boolean;
    level: number;
    shardReward?: number; // Optional shard reward to display
    onComplete: () => void;
}

export function LevelUpAnimation({ show, level, shardReward, onComplete }: LevelUpAnimationProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 pointer-events-none"
                    onAnimationComplete={() => {
                        setTimeout(onComplete, 2000);
                    }}
                >
                    {/* Star burst effect */}
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                                scale: [0, 1, 0],
                                x: Math.cos((i * 30 * Math.PI) / 180) * 200,
                                y: Math.sin((i * 30 * Math.PI) / 180) * 200,
                            }}
                            transition={{
                                duration: 1.5,
                                ease: "easeOut",
                            }}
                            className="absolute"
                        >
                            <Star className="w-8 h-8 text-magic-gold fill-magic-gold" />
                        </motion.div>
                    ))}

                    {/* Center content */}
                    <motion.div
                        initial={{ scale: 0, rotateY: -180 }}
                        animate={{ scale: 1, rotateY: 0 }}
                        transition={{ duration: 0.6, ease: "backOut" }}
                        className="relative z-10 text-center"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                            }}
                        >
                            <Sparkles className="w-16 h-16 text-magic-gold mx-auto mb-4" />
                        </motion.div>

                        <h2 className="text-4xl font-bold text-magic-gold uppercase tracking-widest mb-2">
                            Level Up!
                        </h2>
                        <p className="text-6xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                            {level}
                        </p>

                        {shardReward && shardReward > 0 && (
                            <motion.div
                                initial={{ scale: 0, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ delay: 0.5, type: "spring" }}
                                className="flex flex-col items-center mt-6"
                            >
                                <div className="text-sm text-magic-gold uppercase tracking-wider mb-1">Rewards</div>
                                <div className="flex items-center gap-2 bg-black/40 px-6 py-3 rounded-full border border-magic-gold/50 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-magic-gold blur-sm opacity-50 animate-pulse" />
                                        <div className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-600 rotate-45 transform shadow-lg relative z-10" />
                                    </div>
                                    <span className="text-2xl font-bold text-white">
                                        +{shardReward.toFixed(1)} <span className="text-base text-gray-300 font-normal">SHARDS</span>
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        <p className="text-astral-blue text-sm mt-8 uppercase tracking-wider font-medium">
                            You grow stronger, Traveler
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
