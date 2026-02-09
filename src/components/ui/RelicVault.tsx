"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Relic } from "@/lib/cosmic-brain/relic-system";
import { soundEngine } from "@/lib/sounds";

interface RelicVaultProps {
    isOpen: boolean;
    onClose: () => void;
    unlockedRelics: Relic[];
    currentLevel: number;
}

export function RelicVault({ isOpen, onClose, unlockedRelics, currentLevel }: RelicVaultProps) {
    const handleClose = () => {
        soundEngine.playClick();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 z-40"
                    />

                    {/* Vault Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-midnight-purple border-l-4 border-magic-gold shadow-[0_0_50px_rgba(255,215,0,0.3)] z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-midnight-purple border-b-2 border-magic-gold/30 p-6 z-10">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl text-magic-gold uppercase tracking-widest font-bold flex items-center gap-2">
                                    <Sparkles className="w-6 h-6" />
                                    Relic Vault
                                </h2>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-white/10 transition-colors border-2 border-magic-gold/50"
                                >
                                    <X className="w-5 h-5 text-magic-gold" />
                                </button>
                            </div>
                            <p className="text-sm text-astral-blue">
                                Level {currentLevel} • {unlockedRelics.length} Relics Collected
                            </p>
                        </div>

                        {/* Relic Grid */}
                        <div className="p-6 space-y-4">
                            {unlockedRelics.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-400 text-sm">
                                        No relics collected yet. Level up to earn your first relic!
                                    </p>
                                </div>
                            ) : (
                                unlockedRelics.map((relic, index) => (
                                    <motion.div
                                        key={relic.id}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="border-2 border-magic-gold/50 bg-black/20 p-4 hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className="w-16 h-16 bg-midnight-purple border-2 border-magic-gold flex items-center justify-center text-4xl shrink-0">
                                                {relic.icon}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1">
                                                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-1">
                                                    {relic.name}
                                                </h3>
                                                <p className="text-xs text-gray-400 mb-2">
                                                    {relic.description}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-astral-blue uppercase">
                                                        Level {relic.levelRequired}
                                                    </span>
                                                    {relic.accessory && (
                                                        <span className="text-[10px] text-magic-gold uppercase">
                                                            • Unlocks {relic.accessory.type}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Unlock Effect */}
                                        {relic.accessory && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="mt-3 p-2 bg-magic-gold/10 border border-magic-gold/30 text-center"
                                            >
                                                <p className="text-[10px] text-magic-gold uppercase tracking-wider">
                                                    ✨ AI Girl Accessory Unlocked ✨
                                                </p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-midnight-purple border-t-2 border-magic-gold/30 p-4">
                            <p className="text-xs text-center text-gray-400">
                                Continue leveling up to discover more mystical relics
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
