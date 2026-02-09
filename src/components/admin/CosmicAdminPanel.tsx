"use client";

import { X, RefreshCcw, Zap } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CosmicAdminPanelProps {
    isOpen: boolean;
    onClose: () => void;
    controls: {
        setMood: (mood: number) => void;
        setCrackStage: (stage: 0 | 1 | 2 | 3) => void;
        triggerMiracle: () => void;
        resetSystem: () => void;
    };
    currentState: {
        mood: number;
        crackStage: number;
        miracle: {
            count: number;
            isActive: boolean;
            lastTriggered: number;
        }
    };
}

export function CosmicAdminPanel({ isOpen, onClose, controls, currentState }: CosmicAdminPanelProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="fixed bottom-24 right-4 z-50 w-80 bg-slate-900/90 border border-slate-700 rounded-xl p-4 shadow-2xl backdrop-blur-md text-slate-100"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            Cosmic Admin
                        </h3>
                        <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Mood Control */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Mood</span>
                                <span className="font-mono text-purple-300">{Math.round(currentState.mood)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={currentState.mood}
                                onChange={(e) => controls.setMood(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>

                        {/* Crack Stage */}
                        <div className="space-y-2">
                            <span className="text-sm text-slate-400 block">Crack Progression</span>
                            <div className="flex gap-2">
                                {[0, 1, 2, 3].map((stage) => (
                                    <button
                                        key={stage}
                                        onClick={() => controls.setCrackStage(stage as 0 | 1 | 2 | 3)}
                                        className={`flex-1 py-1.5 px-3 rounded text-sm font-medium transition-all ${currentState.crackStage === stage
                                                ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        {stage}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Miracle Stats */}
                        <div className="bg-slate-800/50 rounded p-3 text-xs text-slate-400 space-y-1">
                            <div className="flex justify-between">
                                <span>Miracles Triggered:</span>
                                <span className="text-amber-400 font-mono">{currentState.miracle.count}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className={currentState.miracle.isActive ? "text-green-400" : "text-slate-500"}>
                                    {currentState.miracle.isActive ? "ACTIVE" : "IDLE"}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={controls.triggerMiracle}
                                disabled={currentState.miracle.isActive}
                                className="flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Zap size={16} />
                                {currentState.miracle.isActive ? 'Active' : 'Miracle'}
                            </button>

                            <button
                                onClick={controls.resetSystem}
                                className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 py-2 rounded-lg transition-colors text-sm font-medium"
                            >
                                <RefreshCcw size={16} />
                                Reset
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
