"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RELICS, Relic } from "@/lib/cosmic-brain/relic-system";
import { AIGirlPortrait } from "./AIGirlPortrait";
import { soundEngine } from "@/lib/sounds";
import { Lock, ShoppingBag, Check, Shield, Package } from "lucide-react";

interface SanctumProps {
    isOpen: boolean;
    onClose: () => void;
    shards: number;
    level: number;
    unlockedItemIds: string[];
    equippedItems: {
        outfit: string;
        headgear: string;
        accessory: string;
    };
    onPurchase: (item: Relic) => void;
    onEquip: (item: Relic) => void;
}

export function Sanctum({
    isOpen,
    onClose,
    shards,
    level,
    unlockedItemIds,
    equippedItems,
    onPurchase,
    onEquip
}: SanctumProps) {
    const [activeTab, setActiveTab] = useState<'outfit' | 'headgear'>('outfit');
    const [selectedBundle, setSelectedBundle] = useState<boolean>(false);

    if (!isOpen) return null;

    const filteredRelics = RELICS.filter(r => r.type === activeTab);

    // Get currently equipped item for this slot
    const currentEquipId = equippedItems[activeTab];

    // Theme Overrides based on equipped outfit
    const isNebulaInitiate = equippedItems.outfit === 'nebula-initiate';
    const isAncientGalaxy = equippedItems.outfit === 'ancient-galaxy-robe';

    const accentText = isAncientGalaxy ? 'text-[#3B82F6]' : isNebulaInitiate ? 'text-[#4DEEEA]' : 'text-magic-gold';
    const accentBg = isAncientGalaxy ? 'bg-[#3B82F6]' : isNebulaInitiate ? 'bg-[#4DEEEA]' : 'bg-magic-gold';
    const accentBorder = isAncientGalaxy ? 'border-[#3B82F6]' : isNebulaInitiate ? 'border-[#4DEEEA]' : 'border-magic-gold';
    const accentShadow = isAncientGalaxy ? 'shadow-[0_0_15px_rgba(59,130,246,0.5)]' : isNebulaInitiate ? 'shadow-[0_0_15px_rgba(77,238,234,0.4)]' : 'shadow-[0_0_15px_rgba(255,215,0,0.4)]';
    const accentGlow = isAncientGalaxy ? 'bg-[#3B82F6]/20' : isNebulaInitiate ? 'bg-[#4DEEEA]/20' : 'bg-magic-gold/20';


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        >
            <div className={`w-full max-w-4xl h-[85vh] flex flex-col md:flex-row bg-midnight-purple border-2 ${accentBorder} rounded-xl overflow-hidden shadow-[0_0_50px_rgba(75,0,130,0.5)] relative`}>

                {/* LEFT PANEL: PREVIEW */}
                <div className="w-full md:w-1/3 bg-black/40 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 relative">
                    <h2 className={`text-2xl font-bold ${accentText} mb-8 tracking-widest uppercase text-center`}>
                        Oracle's <br /> Sanctum
                    </h2>

                    <div className="relative">
                        <div className={`absolute inset-0 ${accentGlow} blur-3xl rounded-full animate-pulse`} />
                        <AIGirlPortrait
                            size="xl"
                            outfitId={equippedItems.outfit}
                            headgearId={equippedItems.headgear}
                            accessoryId={equippedItems.accessory}
                            level={level}
                        />
                    </div>

                    <div className="mt-8 text-center space-y-2">
                        <div className="text-sm text-astral-blue uppercase tracking-wider">Current Tuning</div>
                        <div className="text-white font-mono text-xs p-2 bg-black/50 rounded border border-white/10">
                            {/* Display AI Buff based on equipped outfit/headgear */}
                            {RELICS.find(r => r.id === equippedItems.outfit)?.aiConfig.depth === 'high'
                                ? "🔮 COSMIC OMNISCIENCE"
                                : RELICS.find(r => r.id === equippedItems.headgear)?.aiConfig.depth === 'medium'
                                    ? "🌙 LUNAR ANALYTICS"
                                    : "🧣 BASIC INTUITION"}
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: BOUTIQUE */}
                <div className="flex-1 flex flex-col bg-gradient-to-br from-indigo-950/50 to-purple-950/50">
                    {/* Header / Tabs */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div className="flex gap-4">
                            {(['outfit', 'headgear'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        soundEngine.playClick();
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab
                                        ? `${accentBg} text-midnight-purple ${accentShadow}`
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {tab}s
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            CLOSE
                        </button>
                    </div>

                    {/* Scrollable Grid */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* SPECIAL OFFER: ACCESSORY BUNDLE CARD */}
                            <motion.div
                                onClick={() => setSelectedBundle(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative group p-4 rounded-xl border border-magic-gold/30 bg-gradient-to-br from-magic-gold/10 to-purple-900/20 cursor-pointer overflow-hidden ring-1 ring-magic-gold/50 shadow-lg`}
                            >
                                <div className="absolute top-0 right-0 bg-magic-gold text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                    BUNDLE
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-black/60 rounded-lg flex items-center justify-center border border-white/10">
                                        {/* Placeholder for Bundle Card Asset */}
                                        <Package className="w-8 h-8 text-magic-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm">Seer's Essentials</h3>
                                        <p className="text-xs text-gray-400">Starter Pack</p>
                                        <div className="mt-2 text-magic-gold font-mono text-xs">
                                            Click to View
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {filteredRelics.map((item) => {
                                const isUnlocked = unlockedItemIds.includes(item.id);
                                const isLevelLocked = level < item.levelRequired;
                                const isAffordable = shards >= item.price;
                                const isEquipped = currentEquipId === item.id;

                                return (
                                    <div
                                        key={item.id}
                                        className={`relative group p-4 rounded-xl border transition-all duration-300 overflow-hidden ${isEquipped
                                            ? `bg-gradient-to-br from-magic-gold/20 to-purple-900/40 ${accentBorder} ${accentShadow} ring-1 ring-magic-gold/50`
                                            : isUnlocked
                                                ? 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                                                : 'bg-black/40 border-white/5 grayscale opacity-60'
                                            }`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />

                                        <div className="relative flex justify-between items-start mb-3">
                                            <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                                            {isEquipped && (
                                                <div className={`bg-gradient-to-r ${isAncientGalaxy ? 'from-[#3B82F6] to-blue-600' : isNebulaInitiate ? 'from-[#4DEEEA] to-cyan-500' : 'from-magic-gold to-yellow-500'} text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg tracking-wider`}>
                                                    EQUIPPED
                                                </div>
                                            )}
                                        </div>

                                        <h3 className={`relative text-white font-bold mb-1 tracking-wide group-hover:${isNebulaInitiate ? 'text-[#4DEEEA]' : 'text-magic-gold'} transition-colors`}>{item.name}</h3>
                                        <p className="relative text-xs text-gray-400 mb-4 h-10 line-clamp-2 leading-relaxed">{item.description}</p>

                                        {/* AI BUFF INDICATOR */}
                                        <div className="mb-4 text-[10px] font-mono text-astral-blue flex items-center gap-1">
                                            <Shield className="w-3 h-3" />
                                            AI Depth: {item.aiConfig.depth.toUpperCase()} ({item.aiConfig.maxTokens} tokens)
                                        </div>

                                        {/* ACTION BUTTONS */}
                                        <div className="mt-auto">
                                            {/* Hard lock Ancient Galaxy Robe until level 5 */}
                                            {item.id === 'ancient-galaxy-robe' && level < 5 ? (
                                                <div className="w-full py-2 bg-blue-900/20 border border-blue-500/50 text-blue-400 rounded flex items-center justify-center gap-2 font-bold text-xs uppercase">
                                                    <Lock className="w-3 h-3" />
                                                    Unlocked at Lvl 5
                                                </div>
                                            ) : isUnlocked ? (
                                                isEquipped ? (
                                                    <button disabled className="w-full py-2 bg-white/10 text-white/50 rounded cursor-default font-bold text-xs uppercase">
                                                        Active
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            onEquip(item);
                                                            soundEngine.playLevelUp(); // Reusing a nice sound
                                                        }}
                                                        className={`w-full py-2 ${accentBg} hover:brightness-110 text-midnight-purple font-bold rounded shadow-lg transition-transform active:scale-95 text-xs uppercase`}
                                                    >
                                                        Equip
                                                    </button>
                                                )
                                            ) : isLevelLocked ? (
                                                <div className="w-full py-2 bg-red-900/20 border border-red-900/50 text-red-500 rounded flex items-center justify-center gap-2 font-bold text-xs uppercase">
                                                    <Lock className="w-3 h-3" />
                                                    Lvl {item.levelRequired} Req
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        if (isAffordable) {
                                                            onPurchase(item);
                                                            soundEngine.playStateChange();
                                                        } else {
                                                            // Shake effect or sound could go here
                                                        }
                                                    }}
                                                    disabled={!isAffordable}
                                                    className={`w-full py-2 rounded flex items-center justify-center gap-2 font-bold text-xs uppercase transition-all ${isAffordable
                                                        ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'
                                                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    <ShoppingBag className="w-3 h-3" />
                                                    Buy for {item.price} Shards
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Wallet Footer */}
                    <div className="p-4 bg-black/40 border-t border-white/10 flex justify-between items-center text-sm font-mono text-gray-400">
                        <span>Available Shards:</span>
                        <span className={`font-bold text-lg ${accentText}`}>{shards.toFixed(1)} 💎</span>
                    </div>
                </div>

                {/* MODAL OVERLAY: EXPANDED CARD */}
                <AnimatePresence>
                    {selectedBundle && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 z-50 bg-black/95 flex items-center justify-center p-8"
                        >
                            <div className="w-full max-w-md bg-midnight-purple border-2 border-magic-gold rounded-xl p-6 relative shadow-[0_0_100px_rgba(255,215,0,0.3)]">
                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedBundle(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                >
                                    ✕
                                </button>

                                {/* Info Icon (Requested Feature) */}
                                <div className="absolute top-4 left-4 text-astral-blue" title="Bundle Details">
                                    <Shield className="w-5 h-5" />
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <div className="w-32 h-32 bg-black/60 rounded-xl mb-6 flex items-center justify-center border border-white/20">
                                        <Package className="w-16 h-16 text-magic-gold animate-bounce" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">
                                        Seer's Essentials
                                    </h2>
                                    <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                                        Contains the basic tools for a novice Seer:
                                        <br />
                                        - Crystal Lens
                                        <br />
                                        - Star Chart
                                        <br />
                                        - Focus Ring
                                    </p>

                                    <div className="flex gap-2 w-full">
                                        <button
                                            className="flex-1 py-3 bg-gray-800 text-gray-400 font-bold rounded-lg hover:bg-gray-700 uppercase tracking-wider"
                                            onClick={() => setSelectedBundle(false)}
                                        >
                                            Close
                                        </button>

                                        <button
                                            className="flex-1 py-3 bg-magic-gold text-midnight-purple font-bold rounded-lg shadow-lg hover:brightness-110 uppercase tracking-wider animate-pulse"
                                            onClick={() => {
                                                // Logically equip the 'Seer Essentials' (Starter items)
                                                // This satisfies the condition for 'Strong AI' (has accessory)
                                                const crystal = RELICS.find(r => r.id === 'starter-crystal');
                                                const veil = RELICS.find(r => r.id === 'starter-veil');

                                                if (crystal) onEquip(crystal);
                                                if (veil) onEquip(veil);

                                                soundEngine.playLevelUp();
                                                setTimeout(() => setSelectedBundle(false), 500);
                                            }}
                                        >
                                            Equip Bundle
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.div>
    );
}
