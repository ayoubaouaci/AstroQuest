"use client";

import { PixelBook } from "@/components/ui/PixelBook";
import { StellarParticles } from "@/components/ui/StellarParticles";
import { CelestialMap } from "@/components/ui/CelestialMap";
import { AstrologicalEngine } from "@/lib/cosmic-brain/engine-types";
import { NatalChart } from "@/lib/cosmic-brain/calculations";
import { Quest } from "@/lib/cosmic-brain/quest-generator";
import { getXPProgress } from "@/lib/cosmic-brain/xp-system";
import { soundEngine } from "@/lib/sounds";
import { motion } from "framer-motion";
import Image from "next/image";

interface BookCelestialMapProps {
    chart?: NatalChart;
    quests: Quest[];
    totalXP: number;
    level: number;
    shards?: number;
    onQuestToggle: (questId: string) => void;
    showFortune?: boolean;
    fortuneText?: string;
    engineData?: AstrologicalEngine;
    onConsult?: () => void;
}

export function BookCelestialMap({
    chart,
    quests,
    totalXP,
    level,
    shards,
    onQuestToggle,
    showFortune = false,
    fortuneText,
    engineData,
    onConsult
}: BookCelestialMapProps) {
    const xpProgress = getXPProgress(totalXP);
    const completedCount = quests.filter(q => q.completed).length;

    const handleQuestClick = (questId: string) => {
        soundEngine.playClick();
        onQuestToggle(questId);
    };

    const LeftPageContent = (
        <div className="relative flex flex-col h-full overflow-hidden text-[#3e2723]">
            {/* FORBIDDEN TITLE */}
            <h2 className="font-pixel text-[10px] md:text-sm uppercase tracking-widest text-red-900/60 text-center mb-2 md:mb-4 border-b-2 border-[#3e2723]/20 pb-2">
                Forbidden Prophecy
            </h2>

            {/* SEER'S WRITING */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 font-pixel text-[10px] md:text-xs leading-loose italic opacity-80">
                <p>
                    "The stars align in patterns that scream of the old times. {chart?.sunSign || 'Traveler'}, your arrival was foretold in the burned pages."
                </p>

                <div className="w-full h-[1px] bg-red-900/20 my-2" />

                {fortuneText ? (
                    <div className="relative p-3 bg-[#3e2723]/5 border-l-2 border-red-900/30">
                        <p className="text-[#4a0404]">
                            "{fortuneText}"
                        </p>
                    </div>
                ) : (
                    <p className="opacity-50">
                        "The Archive is silent... for now. But the Stars are watching."
                    </p>
                )}

                <div className="mt-8 flex items-center justify-center opacity-40">
                    <span className="text-2xl">👁️</span>
                </div>
            </div>
        </div>
    );

    const RightPageContent = (
        <div className="relative flex flex-col h-full overflow-hidden text-[#3e2723]">
            {/* ENGINE DATA OVERRIDE: Show Celestial Chart */}
            {engineData ? (
                <div className="h-full w-full flex flex-col">
                    <h2 className="font-pixel text-[10px] md:text-sm uppercase tracking-widest text-[#2a1202] text-center mb-2 md:mb-4 border-b-2 border-[#3e2723]/20 pb-2 relative z-10">
                        Natal Chart
                    </h2>
                    <div className="flex-1 relative rounded-lg overflow-hidden border border-[#3e2723]/20 shadow-inner">
                        <CelestialMap engineData={engineData} />
                    </div>
                </div>
            ) : (
                <>
                    {/* Background Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
                        <svg className="w-64 h-64 animate-spin-slow" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                            <path d="M50,20 L50,80 M20,50 L80,50" stroke="currentColor" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                            <circle cx="50" cy="50" r="3" fill="currentColor" />
                        </svg>
                    </div>

                    {/* COSMIC OPERATIONS HEADER */}
                    <h2 className="font-pixel text-[10px] md:text-sm uppercase tracking-widest text-[#2a1202] text-center mb-2 md:mb-4 border-b-2 border-[#3e2723]/20 pb-2 relative z-10">
                        Cosmic Operations
                    </h2>

                    {/* OPERATIONS LIST */}
                    <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                        {quests.map((quest) => (
                            <div
                                key={quest.id}
                                onClick={() => handleQuestClick(quest.id)}
                                className={`group cursor-pointer transition-all duration-300 ${quest.completed ? 'opacity-40 grayscale' : 'opacity-100'} mb-4`}
                            >
                                <div className="flex items-start gap-2">
                                    {/* Ink Star Bullet */}
                                    <div className="mt-1 w-3 h-3 relative flex-shrink-0">
                                        <Image
                                            src="/pixel-star.png"
                                            alt="star"
                                            fill
                                            className={`object-contain mix-blend-multiply ${quest.completed ? 'opacity-30' : ''}`}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-pixel text-[9px] md:text-[10px] leading-tight mb-1 md:mb-2 ${quest.completed ? 'line-through opacity-60' : 'text-[#2a1202]'}`}>
                                            {quest.title}
                                        </h3>
                                        <p className="font-pixel text-[8px] md:text-[9px] leading-relaxed opacity-80">
                                            {quest.description}
                                        </p>

                                        {level >= 5 && quest.voidLore && (
                                            <div className="mt-2 pl-2 border-l-2 border-purple-900/30 overflow-hidden">
                                                <p className="font-pixel text-[8px] text-purple-900/50 uppercase tracking-widest mb-1">
                                                    [HIDDEN DATA]
                                                </p>
                                                <p className="font-pixel text-[8px] text-[#4a0404] blur-sm hover:blur-none transition-all duration-500 select-none">
                                                    {quest.voidLore}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );


    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-full flex items-center justify-center animate-breathing"
        >
            <PixelBook
                leftContent={LeftPageContent}
                rightContent={RightPageContent}
            />

            {/* Candlelight Warmth Overlay */}
            <motion.div
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-amber-500/10 pointer-events-none mix-blend-overlay"
            />
            <StellarParticles />
        </motion.div>
    );
}
