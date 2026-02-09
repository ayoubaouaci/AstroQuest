"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Settings, Zap, Database, RefreshCw, Star } from "lucide-react";
import { soundEngine } from "@/lib/sounds";

interface AdminPanelProps {
    isVisible: boolean;
    currentLevel: number;
    currentXP: number;
    currentShards: number;
    simulationMode: boolean;
    onSetLevel: (level: number) => void;
    onSetXP: (xp: number) => void;
    onSetShards: (shards: number) => void;
    onResetQuests: () => void;
    onToggleSimulation: (enabled: boolean) => void;
}

export function AdminPanel({
    isVisible,
    currentLevel,
    currentXP,
    currentShards,
    simulationMode,
    onSetLevel,
    onSetXP,
    onSetShards,
    onResetQuests,
    onToggleSimulation
}: AdminPanelProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-20 z-[9999]">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full border-2 shadow-lg transition-colors ${simulationMode
                    ? "bg-red-900 border-red-500 text-red-500 animate-pulse"
                    : "bg-black/80 border-gray-600 text-gray-400"
                    }`}
                title="Admin Control"
            >
                <Shield className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-12 right-0 w-72 bg-black/95 border border-gray-700 rounded-lg shadow-2xl p-4 text-xs font-mono"
                    >
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-800">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <Settings className="w-4 h-4 text-gray-400" />
                                SYSTEM OVERRIDE
                            </h3>
                            <span className="text-[10px] text-gray-500">v1.0.0-QA</span>
                        </div>

                        {/* Simulation Mode Toggle */}
                        <div className="mb-4">
                            <label className="flex items-center justify-between cursor-pointer p-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
                                <span className="text-gray-300 font-bold">Simulation Mode</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={simulationMode}
                                        onChange={(e) => {
                                            onToggleSimulation(e.target.checked);
                                            soundEngine.playClick();
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                                </div>
                            </label>
                            <p className="mt-1 text-[10px] text-gray-500">
                                {simulationMode
                                    ? "⚠ INFINITE SHARDS ENABLED"
                                    : "Normal Production Limits Active"}
                            </p>
                        </div>

                        {/* Level Controls */}
                        <div className="mb-4 space-y-2">
                            <div className="text-gray-400 flex items-center gap-2">
                                <Star className="w-3 h-3" />
                                Set Level (Current: {currentLevel})
                            </div>
                            <div className="flex gap-1 justify-between">
                                {[1, 5, 10, 15, 20].map((lvl) => (
                                    <button
                                        key={lvl}
                                        onClick={() => {
                                            onSetLevel(lvl);
                                            soundEngine.playLevelUp();
                                        }}
                                        className={`px-2 py-1 rounded border ${currentLevel === lvl
                                            ? "bg-magic-gold text-black border-magic-gold"
                                            : "bg-black text-gray-400 border-gray-700 hover:border-gray-500"
                                            }`}
                                    >
                                        L{lvl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Shard Controls */}
                        <div className="mb-4 space-y-2">
                            <div className="text-gray-400 flex items-center gap-2">
                                <Zap className="w-3 h-3" />
                                Wallet (Current: {currentShards.toFixed(1)})
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                                <button onClick={() => onSetShards(0)} className="bg-red-900/30 text-red-400 border border-red-900/50 rounded px-2 py-1 hover:bg-red-900/50">Zero</button>
                                <button onClick={() => onSetShards(5)} className="bg-gray-800 text-gray-300 border border-gray-700 rounded px-2 py-1 hover:bg-gray-700">Set 5</button>
                                <button onClick={() => onSetShards(100)} className="bg-green-900/30 text-green-400 border border-green-900/50 rounded px-2 py-1 hover:bg-green-900/50">Min/Max</button>
                            </div>
                        </div>

                        {/* Quest Controls */}
                        <div className="mb-2">
                            <button
                                onClick={() => {
                                    onResetQuests();
                                    soundEngine.playClick();
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-blue-900/20 hover:bg-blue-900/40 text-blue-400 border border-blue-900/50 rounded p-2 transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Force Reset Quests
                            </button>
                        </div>

                        <div className="mt-4 pt-2 border-t border-gray-800 text-[10px] text-gray-600 text-center">
                            Authorized: User ID 'ayoub'
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
