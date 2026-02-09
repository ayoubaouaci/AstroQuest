"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Moon, Sun } from "lucide-react";
import { soundEngine } from "@/lib/sounds";

interface CosmicAltarProps {
    isOpen: boolean;
    onClose: () => void;
    onRefill: (amount: number) => void;
    currentShards: number;
}

export function CosmicAltar({ isOpen, onClose, onRefill, currentShards }: CosmicAltarProps) {
    const handleRefill = (amount: number) => {
        soundEngine.playLevelUp();
        onRefill(amount);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-midnight-purple border-4 border-magic-gold p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(255,215,0,0.2)]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-magic-gold hover:scale-110 transition-transform"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 mx-auto mb-4 border-2 border-dashed border-magic-gold rounded-full flex items-center justify-center"
                            >
                                <Sparkles className="text-magic-gold w-10 h-10" />
                            </motion.div>
                            <h2 className="text-3xl font-pixel text-magic-gold uppercase tracking-[0.2em]">Cosmic Altar</h2>
                            <p className="text-astral-blue text-sm mt-2 italic">Offer your intention to the stars for energy.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-black/40 border border-magic-gold/30 text-center">
                                <span className="text-xs text-gray-400 uppercase tracking-widest">Current Balance</span>
                                <div className="text-2xl text-white font-pixel mt-1 flex items-center justify-center gap-2">
                                    {currentShards.toFixed(1)} <div className="w-4 h-4 bg-emerald-400 shadow-[0_0_8px_#10b981]" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
                                </div>
                            </div>

                            <button
                                onClick={() => handleRefill(10)}
                                className="w-full py-4 bg-magic-gold/20 border-2 border-magic-gold text-magic-gold font-pixel uppercase tracking-widest hover:bg-magic-gold/30 transition-all flex items-center justify-center gap-3 group"
                            >
                                <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                Communion of Light (+10 Shards)
                            </button>

                            <button
                                onClick={() => handleRefill(25)}
                                className="w-full py-4 bg-astral-blue/20 border-2 border-astral-blue text-astral-blue font-pixel uppercase tracking-widest hover:bg-astral-blue/30 transition-all flex items-center justify-center gap-3 group"
                            >
                                <Moon className="w-5 h-5 group-hover:-rotate-45 transition-transform" />
                                Abyssal Reflection (+25 Shards)
                            </button>
                        </div>

                        <div className="mt-8 text-[10px] text-gray-500 text-center uppercase tracking-tighter">
                            A simulated transaction for testing cosmic harmony
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
