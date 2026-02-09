"use client";

import { motion } from "framer-motion";
import { ZodiacSign } from "@/lib/zodiac-data";
import { Sparkles, ArrowRight, BookOpen, Star } from "lucide-react";
import Image from "next/image";

interface SkillRevealProps {
    sign: ZodiacSign;
    onAccept: () => void;
}

export function SkillReveal({ sign, onAccept }: SkillRevealProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col items-center justify-between"
        >
            {/* TOP SECTION: Large Pulsing Card */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, type: "spring" }}
                className="relative z-10 mt-4 md:mt-8"
            >
                <div className="relative w-[200px] h-[300px] md:w-[250px] md:h-[380px] rounded-xl p-1 bg-gradient-to-b from-[#ffd700] via-purple-600 to-[#1a0033] shadow-[0_0_60px_rgba(255,215,0,0.3)] animate-pulse">
                    <div className="w-full h-full bg-[#0a0518] rounded-lg overflow-hidden relative">
                        <Image
                            src={sign.image}
                            alt={sign.name}
                            fill
                            className="object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <h2 className="text-3xl font-serif text-[#ffd700] tracking-widest uppercase filter drop-shadow-md">{sign.name}</h2>
                            <p className="text-xs text-white/70 uppercase tracking-wider">{sign.dates}</p>
                        </div>

                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                            <span className="text-2xl filter drop-shadow-lg">{sign.symbol}</span>
                            <div className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] text-white">
                                {sign.element}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* MIDDLE SECTION: Detail Panel */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-full max-w-4xl bg-[#1a0b2e]/80 border border-purple-500/30 backdrop-blur-md rounded-2xl p-6 md:p-8 my-6 flex flex-col md:flex-row items-center gap-8 shadow-2xl"
            >
                {/* Visual Avatar (Small Seer) */}
                <div className="hidden md:flex flex-col items-center gap-2 text-purple-200/50">
                    <div className="w-20 h-20 rounded-full bg-indigo-900 border border-purple-500/30 flex items-center justify-center">
                        <span className="text-3xl">🔮</span>
                    </div>
                </div>

                {/* Skill Content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
                        <h3 className="text-yellow-400 font-serif tracking-widest text-sm uppercase">Celestial Gift Unlocked</h3>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        {sign.skill}
                    </h1>

                    <div className="bg-black/30 rounded-lg p-4 border-l-4 border-purple-500">
                        <p className="text-lg text-purple-100 leading-relaxed font-serif">
                            {sign.effect}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* BOTTOM SECTION: Wisdom & Buttons */}
            <div className="w-full max-w-3xl flex flex-col items-center gap-8 mb-8">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center text-purple-200/70 italic font-serif text-lg leading-relaxed max-w-2xl"
                >
                    "As a child of {sign.name}, you possess the spirit of {sign.planet}. Use your gift of {sign.skill} wisely in your quest..."
                </motion.p>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="flex flex-col md:flex-row gap-4 w-full justify-center"
                >
                    <button
                        onClick={onAccept}
                        className="group relative px-8 py-3 bg-[#ffd700] hover:bg-[#ffed4a] text-[#1a0033] font-bold tracking-widest uppercase rounded flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] transition-all"
                    >
                        <span>Accept Destiny</span>
                        <Sparkles className="w-4 h-4" />
                    </button>

                    <button className="px-6 py-3 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/30 text-blue-200 uppercase tracking-wider text-sm rounded transition-colors flex items-center justify-center gap-2">
                        <span>See Compatibility</span>
                    </button>

                    <button className="px-6 py-3 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 uppercase tracking-wider text-sm rounded transition-colors flex items-center justify-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Ask For Prophecy</span>
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}
