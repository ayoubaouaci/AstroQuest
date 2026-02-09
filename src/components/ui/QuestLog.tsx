import { motion, AnimatePresence } from "framer-motion";
import { PixelCard } from "./PixelCard";
import {
    X, Scroll, CheckCircle2, Circle,
    Feather, Heart, Flame, Compass, Hourglass,
    Zap, Waves, Sparkles, Ghost, Moon, Clock
} from "lucide-react";
import { Quest } from "@/lib/cosmic-brain/quest-generator";
import { useEffect, useState } from "react";

interface QuestLogProps {
    isOpen: boolean;
    onClose: () => void;
    quests: Quest[];
    onToggleQuest?: (id: string) => void;
}

// Helper to map planet to icon
const getPlanetIcon = (planet: string) => {
    switch (planet) {
        case 'Mercury': return <Feather className="w-3 h-3 text-cyan-300" />;
        case 'Venus': return <Heart className="w-3 h-3 text-pink-300" />;
        case 'Mars': return <Flame className="w-3 h-3 text-red-500" />;
        case 'Jupiter': return <Compass className="w-3 h-3 text-orange-400" />;
        case 'Saturn': return <Hourglass className="w-3 h-3 text-amber-600" />;
        case 'Uranus': return <Zap className="w-3 h-3 text-electric-blue" />;
        case 'Neptune': return <Waves className="w-3 h-3 text-indigo-400" />;
        case 'Pluto': return <Ghost className="w-3 h-3 text-purple-500" />;
        case 'Moon': return <Moon className="w-3 h-3 text-gray-200" />;
        default: return <Sparkles className="w-3 h-3 text-magic-gold" />;
    }
}

export function QuestLog({ isOpen, onClose, quests, onToggleQuest }: QuestLogProps) {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const lastCompletionDate = localStorage.getItem("astroquest_quest_completion_date");

            // If completed today, countdown to tomorrow's midnight
            // If NOT completed today, countdown to tomorrow's midnight (same visual, logic differs)
            // But user wants "immediately starting a new ~24h countdown"
            // Wait, if I complete it at 10AM, next midnight is 14h away. 
            // If I haven't completed it, next midnight is also 14h away.
            // The request says: "If lastFullCompletionDate is today → show 'Quests complete! New ones tomorrow'"
            // "Else → show normal countdown"

            // So visual change is the MESSAGE + Timer

            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (lastCompletionDate === todayStr) {
                setTimeLeft(`next cycle: ${hours}h ${minutes}m`);
            } else {
                setTimeLeft(`${hours}h ${minutes}m`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 60000);
        return () => clearInterval(interval);
    }, [quests]); // Depend on quests to refresh if they change

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md max-h-[80vh] flex flex-col"
                    >
                        <PixelCard
                            className={`flex flex-col h-full bg-[#1a0f2e] border-magic-gold relative transition-all duration-1000 ${quests.every(q => q.completed) && quests.length > 0
                                ? "shadow-[0_0_50px_rgba(255,215,0,0.4)] border-amber-300"
                                : ""
                                }`}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b-2 border-magic-gold/30 pb-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <Scroll className="w-6 h-6 text-magic-gold" />
                                    <div>
                                        <h2 className="text-xl font-bold text-magic-gold uppercase tracking-widest font-pixel">
                                            Prophecies
                                        </h2>
                                        <div className="flex items-center gap-1 text-[10px] text-white/50 overflow-hidden">
                                            <Clock className="w-3 h-3" />
                                            <span>Resets in {timeLeft}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-white/70 hover:text-white" />
                                </button>
                            </div>

                            {/* Scrollable Quest List */}
                            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                {quests.length === 0 ? (
                                    <div className="text-center py-10 text-white/50 text-sm font-pixel">
                                        No active prophecies written in the stars...
                                    </div>
                                ) : (
                                    quests.map((quest) => (
                                        <div
                                            key={quest.id}
                                            onClick={() => onToggleQuest && onToggleQuest(quest.id)}
                                            className={`
                        group relative p-4 rounded-lg border-2 transition-all cursor-pointer
                        ${quest.completed
                                                    ? 'bg-green-900/20 border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.2)]'
                                                    : 'bg-black/40 border-white/10 hover:border-magic-gold/50 hover:bg-white/5'
                                                }
                      `}
                                        >
                                            {quest.completed && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shine pointer-events-none" />
                                            )}
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1 transition-colors">
                                                    {quest.completed ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-magic-gold animate-pulse drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className={`font-bold mb-1 font-pixel text-xs leading-relaxed ${quest.completed ? 'text-magic-gold line-through opacity-70' : 'text-white'}`}>
                                                        {quest.title}
                                                    </h3>
                                                    <p className="text-xs text-blue-200/70 mb-2 leading-snug">
                                                        {quest.description}
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-white/50 border border-white/10 flex items-center gap-1">
                                                            {getPlanetIcon(quest.planet)}
                                                            {quest.planet}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-magic-gold">
                                                            +{quest.xp} XP
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer Decoration */}
                            <div className="text-center pt-4 border-t border-magic-gold/20 mt-2">
                                <p className="text-[10px] text-magic-gold/50 uppercase tracking-[0.2em] font-pixel">
                                    AstroQuest Archive
                                </p>
                            </div>
                        </PixelCard>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
