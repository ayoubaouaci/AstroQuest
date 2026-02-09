'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoonSignIconProps {
    birthDate?: string;
    className?: string;
}

// Simplified Moon Sign Calculator
const calculateMoonSign = (birthDate: string) => {
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    // Simple calculation for demo
    const moonCycle = (day + month * 30) % 12;

    const moonSigns = [
        { symbol: '🌑', name: 'Aries', element: 'Fire', emotion: 'Passionate' },
        { symbol: '🌒', name: 'Taurus', element: 'Earth', emotion: 'Stable' },
        { symbol: '🌓', name: 'Gemini', element: 'Air', emotion: 'Curious' },
        { symbol: '🌔', name: 'Cancer', element: 'Water', emotion: 'Nurturing' },
        { symbol: '🌕', name: 'Leo', element: 'Fire', emotion: 'Dramatic' },
        { symbol: '🌖', name: 'Virgo', element: 'Earth', emotion: 'Analytical' },
        { symbol: '🌗', name: 'Libra', element: 'Air', emotion: 'Balanced' },
        { symbol: '🌘', name: 'Scorpio', element: 'Water', emotion: 'Intense' },
        { symbol: '🌑', name: 'Sagittarius', element: 'Fire', emotion: 'Adventurous' },
        { symbol: '🌒', name: 'Capricorn', element: 'Earth', emotion: 'Ambitious' },
        { symbol: '🌓', name: 'Aquarius', element: 'Air', emotion: 'Innovative' },
        { symbol: '🌔', name: 'Pisces', element: 'Water', emotion: 'Dreamy' }
    ];

    return moonSigns[moonCycle];
};

// Moon Phase Emojis
const getMoonPhase = () => {
    const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
    const now = new Date();
    const phaseIndex = Math.floor((now.getDate() % 8));
    return phases[phaseIndex];
};

export default function MoonSignIcon({ birthDate = '1995-08-15', className, onAskOracle }: MoonSignIconProps & { onAskOracle?: (question: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [moonSign, setMoonSign] = useState<any>(null);
    const [moonPhase, setMoonPhase] = useState('🌑');
    const [sortedSigns, setSortedSigns] = useState<any[]>([]);

    useEffect(() => {
        // Calculate moon sign
        const sign = calculateMoonSign(birthDate);
        setMoonSign(sign);

        // Update moon phase
        setMoonPhase(getMoonPhase());

        // Update phase every hour
        const interval = setInterval(() => {
            setMoonPhase(getMoonPhase());
        }, 3600000);

        return () => clearInterval(interval);
    }, [birthDate]);

    // Calculate and Sort Compatibility
    useEffect(() => {
        if (!moonSign) return;

        const allSigns = ['Cancer', 'Scorpio', 'Pisces', 'Taurus', 'Virgo', 'Capricorn', 'Gemini', 'Libra', 'Aquarius', 'Aries', 'Leo', 'Sagittarius'];

        const getCompatibility = (targetSign: string) => {
            // Simple Element Logic
            const targetElement = getElementForSign(targetSign);
            const myElement = moonSign.element;

            if (targetSign === moonSign.name) return 98; // Same Sign
            if (myElement === targetElement) return 95; // Same Element

            // Compatible Elements
            if ((myElement === 'Water' && targetElement === 'Earth') || (myElement === 'Earth' && targetElement === 'Water')) return 90;
            if ((myElement === 'Fire' && targetElement === 'Air') || (myElement === 'Air' && targetElement === 'Fire')) return 90;

            // Opposing but magnetic
            if (isOpposite(moonSign.name, targetSign)) return 85;

            return Math.floor(Math.random() * 30) + 50; // Neutral/Clash
        };

        const calculated = allSigns
            .filter(s => s !== moonSign.name)
            .map(s => ({
                name: s,
                percent: getCompatibility(s),
                element: getElementForSign(s)
            }))
            .sort((a, b) => b.percent - a.percent);

        setSortedSigns(calculated);
        console.log("Moon screen enhanced: sorted compat + Ask buttons + glow");
    }, [moonSign]);

    const getElementForSign = (sign: string) => {
        if (['Aries', 'Leo', 'Sagittarius'].includes(sign)) return 'Fire';
        if (['Taurus', 'Virgo', 'Capricorn'].includes(sign)) return 'Earth';
        if (['Gemini', 'Libra', 'Aquarius'].includes(sign)) return 'Air';
        return 'Water';
    };

    const isOpposite = (sign1: string, sign2: string) => {
        const pairs = [['Aries', 'Libra'], ['Taurus', 'Scorpio'], ['Gemini', 'Sagittarius'], ['Cancer', 'Capricorn'], ['Leo', 'Aquarius'], ['Virgo', 'Pisces']];
        return pairs.some(p => p.includes(sign1) && p.includes(sign2));
    };

    const getExplanation = (target: any) => {
        const cosmicTone = [
            "harmonizes with your emotional tides",
            "ignites a spark of mutual understanding",
            "grounds your floating spirit",
            "breathes life into your dreams"
        ];
        const tone = cosmicTone[Math.floor(Math.random() * cosmicTone.length)];
        return `${target.name}'s ${target.element} energy ${tone}, creating a deep ${moonSign?.element} bond.`;
    };

    return (
        <>
            {/* Floating Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={className || "fixed bottom-[180px] left-4 z-[60]"}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative group block"
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center shadow-2xl shadow-purple-500/50 border-2 border-purple-400/50 hover:border-purple-300 transition-all duration-300">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="text-2xl md:text-3xl"
                        >
                            {moonPhase}
                        </motion.div>
                        <div className="absolute inset-0 rounded-full border-2 border-purple-300/30 animate-ping"></div>
                    </div>
                </button>
            </motion.div>

            {/* Moon Signs Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed inset-0 z-[60] flex items-end justify-center md:items-center"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                        <div
                            className="relative w-full max-w-2xl bg-gradient-to-b from-gray-900 to-black border-t md:border border-purple-500/30 rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute -top-12 left-1/2 md:left-auto md:-top-4 md:-right-4 transform -translate-x-1/2 md:translate-x-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg lg:hover:scale-110 transition-transform"
                            >
                                ✕
                            </button>

                            {/* Header */}
                            <div className="p-6 border-b border-purple-500/20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl">{moonPhase}</div>
                                        <div>
                                            <h2 className="text-xl md:text-2xl font-bold text-white">Moon Signs & Compatibility</h2>
                                            <p className="text-gray-400 text-sm md:text-base">Your emotional and intuitive nature</p>
                                        </div>
                                    </div>
                                    <div className="text-4xl animate-pulse hidden md:block">🌙</div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-8">
                                {/* Current Moon Sign */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-300">
                                        <span>✨</span> Your Moon Sign
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-4 border border-blue-500/30 flex flex-col items-center justify-center">
                                            <div className="text-4xl text-center mb-2">{moonSign?.symbol}</div>
                                            <div className="text-center">
                                                <div className="font-bold text-lg text-white">{moonSign?.name}</div>
                                                <div className="text-sm text-gray-400">{moonSign?.element}</div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-pink-900/30 to-red-900/30 rounded-xl p-4 border border-pink-500/30 flex flex-col justify-center animate-glow-pulse shadow-[0_0_15px_rgba(255,105,180,0.3)]">
                                            <div className="text-center">
                                                <div className="text-sm text-gray-400 mb-1">Current Phase</div>
                                                <div className="text-3xl mb-2">{moonPhase}</div>
                                                <div className="text-sm text-gray-300">
                                                    {moonPhase === '🌑' && 'New Moon - New Beginnings'}
                                                    {moonPhase === '🌕' && 'Full Moon - Manifestation'}
                                                    {moonPhase.includes('🌒') && 'Waxing Crescent - Growth'}
                                                    {moonPhase.includes('🌖') && 'Waning Gibbous - Release'}
                                                    {!['🌑', '🌕'].includes(moonPhase) && !moonPhase.includes('🌒') && !moonPhase.includes('🌖') && 'Transition Phase'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Moon Compatibility - SORTED & PERSONALIZED */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-300">
                                        <span>💫</span> Moon Sign Compatibility
                                    </h3>
                                    <div className="space-y-3">
                                        {sortedSigns.slice(0, 3).map((sign, index) => (
                                            <div key={index} className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl p-4 border border-purple-500/20 flex flex-col md:flex-row items-center gap-4">
                                                <div className="flex items-center gap-3 min-w-[120px]">
                                                    <div className="text-3xl bg-black/30 rounded-full w-12 h-12 flex items-center justify-center border border-white/10">
                                                        {getSymbol(sign.name)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{sign.name}</div>
                                                        <div className="text-xs text-green-400 font-mono">{sign.percent}% Match</div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-sm text-gray-300 italic text-center md:text-left">
                                                    "{getExplanation(sign)}"
                                                </div>
                                                <button
                                                    onClick={() => onAskOracle?.(`How does ${sign.name} influence my emotional compatibility as a ${moonSign?.name} Moon?`)}
                                                    className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 rounded-full text-xs text-purple-200 font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
                                                >
                                                    Ask Oracle
                                                </button>
                                            </div>
                                        ))}

                                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                                            {sortedSigns.slice(3, 11).map((sign, index) => (
                                                <div key={index} className="bg-gray-800/30 rounded-lg p-3 text-center hover:bg-gray-700/50 transition-colors border border-white/5 relative group">
                                                    <div className="text-xl mb-1">{getSymbol(sign.name)}</div>
                                                    <div className="font-bold text-xs text-gray-300">{sign.name}</div>
                                                    <div className="text-[10px] text-gray-500">{sign.percent}%</div>

                                                    {/* Mini Ask Button on Hover */}
                                                    <button
                                                        onClick={() => onAskOracle?.(`How does ${sign.name} influence my emotional compatibility as a ${moonSign?.name} Moon?`)}
                                                        className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                                                    >
                                                        <span className="text-[10px] text-purple-300 font-bold uppercase">Ask</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-purple-500/20 text-center text-sm text-gray-500">
                                Tap outside to close • Moon data updates hourly
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

const getSymbol = (name: string) => {
    const map: Record<string, string> = { 'Cancer': '♋', 'Scorpio': '♏', 'Pisces': '♓', 'Taurus': '♉', 'Virgo': '♍', 'Capricorn': '♑', 'Gemini': '♊', 'Libra': '♎', 'Aquarius': '♒', 'Aries': '♈', 'Leo': '♌', 'Sagittarius': '♐' };
    return map[name] || '★';
};
