"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronUp, Volume2, VolumeX, MinusSquare, Maximize2, Send, Minimize2, Sparkles } from "lucide-react";
import { AIGirlPortrait } from "./AIGirlPortrait";
import { Relic } from "@/lib/cosmic-brain/relic-system";
import { soundEngine } from "@/lib/sounds";
import { GeminiService, UserProfile, ItemContext } from "@/lib/cosmic-brain/gemini-service";
import { NatalChart, getCurrentMoonPhase } from "@/lib/cosmic-brain/calculations";
import { ShardAnimation } from "./ShardAnimation";
import { Package, HelpCircle, AlertTriangle } from "lucide-react";
import { GlitchedText } from "./GlitchedText";

import { OracleModule } from "@/lib/cosmic-brain/engine-types";

interface DialogueBoxProps {
    text: string;
    mood?: "prophetic" | "mysterious" | "urgent";
    outfitId?: string;
    headgearId?: string;
    accessoryId?: string;
    chart?: NatalChart | null;
    profile?: UserProfile | null; // User identity for personalization
    itemContext?: ItemContext; // Equipped items for AI context
    onForecastRequest?: (type: 'day' | 'month' | 'year') => void;
    canAskForecast?: boolean;
    shards?: number;
    onSpendShards?: (amount: number) => void;
    simulationMode?: boolean; // Admin bypass for costs
    onStateChange?: (isOpen: boolean) => void;
    oracleData?: OracleModule;
    isVisible?: boolean;
    defaultMinimized?: boolean;
    initialQuestion?: string;
    level?: number;
}

export function DialogueBox({ text, mood = "prophetic", outfitId, headgearId, accessoryId, chart = null, profile = null, itemContext, onForecastRequest, canAskForecast = false, shards = 0, onSpendShards, simulationMode = false, onStateChange, oracleData, isVisible: initialVisible = true, defaultMinimized = false, initialQuestion, level = 1 }: DialogueBoxProps) {
    const [isMinimized, setIsMinimized] = useState(defaultMinimized);
    const [isVisible, setIsVisible] = useState(initialVisible);
    const [isMuted, setIsMuted] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Handle initial question from external triggers (like Moon Sign modal)
    useEffect(() => {
        if (initialQuestion) {
            setInputValue(initialQuestion);
            // Optional: Auto-expand if minimized?
            if (isMinimized) {
                toggleMinimize();
            }
        }
    }, [initialQuestion]);
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', content: string }[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [displayedText, setDisplayedText] = useState(text);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [shardAnim, setShardAnim] = useState<{ x: number, y: number } | null>(null);
    const [useStarCurrency, setUseStarCurrency] = useState(false); // Toggle for Star Mode

    // Notify parent of state changes
    useEffect(() => {
        if (onStateChange) {
            onStateChange(isVisible && !isMinimized);
        }
    }, [isVisible, isMinimized, onStateChange]);

    // Update displayed text when prop changes
    useEffect(() => {
        setDisplayedText(text);
    }, [text]);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, displayedText, isTyping]);

    // Load chat history from storage
    useEffect(() => {
        const savedHistory = localStorage.getItem("astroquest_chat_history");
        if (savedHistory) {
            try {
                setChatHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        }
    }, []);

    // Save chat history to storage
    useEffect(() => {
        if (chatHistory.length > 0) {
            localStorage.setItem("astroquest_chat_history", JSON.stringify(chatHistory));
        }
    }, [chatHistory]);

    // Auto-hide removed to keep AI persistent
    useEffect(() => {
        // Play 8-bit speech sound when text updates (only if visible and not minimized)
        if (!isMinimized && isVisible) {
            const speechInterval = setInterval(() => {
                soundEngine.playSpeech();
            }, 100);
            setTimeout(() => clearInterval(speechInterval), 500);
        }
    }, [text, isMinimized]);

    const toggleMute = () => {
        const newMute = !isMuted;
        setIsMuted(newMute);
        soundEngine.setMuted(newMute);
        soundEngine.playClick();
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
        setIsVisible(true);
        soundEngine.playClick();
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !chart || isTyping) return;

        const userMsg = inputValue.trim();
        const CHAT_COST = 1.0; // Cost per chat message

        // Validate shard balance before sending (bypass if simulation mode)
        if (!simulationMode && shards < CHAT_COST) {
            soundEngine.playClick();
            setChatHistory(prev => [...prev,
            { role: 'user', content: userMsg },
            { role: 'model', content: '⚠️ Your shards are insufficient. Please refill your balance or complete quests to earn 0.5 shards.' }
            ]);
            setInputValue("");
            return;
        }

        setInputValue("");

        // Remove last message if it was an error to clear UI for new attempt
        setChatHistory(prev => {
            const newHistory = [...prev];
            if (newHistory.length > 0 && (newHistory[newHistory.length - 1].content.includes("Error") || newHistory[newHistory.length - 1].content.includes("insufficient"))) {
                newHistory.pop();
            }
            return [...newHistory, { role: 'user', content: userMsg }];
        });

        setIsTyping(true);
        soundEngine.playClick();

        // Check for forecast keywords
        const lowerMsg = userMsg.toLowerCase();
        if (lowerMsg.includes('forecast') || lowerMsg.includes('future') || lowerMsg.includes('prediction')) {
            try {
                // Always allow forecast - Quest Gate Removed
                let response = "";
                if (lowerMsg.includes('day')) {
                    response = await GeminiService.getForecast('day', chart, profile || undefined);
                } else if (lowerMsg.includes('month')) {
                    response = await GeminiService.getForecast('month', chart, profile || undefined);
                } else if (lowerMsg.includes('year')) {
                    response = await GeminiService.getForecast('year', chart, profile || undefined);
                } else {
                    response = await GeminiService.getChatResponse("The user is asking for a forecast but hasn't specified day, month, or year. Ask them which one they desire.", chart, chatHistory, profile || undefined, itemContext);
                }

                // Deduct shards only on successful response (disabled in Simulation Mode)
                if (!simulationMode) {
                    onSpendShards?.(CHAT_COST);
                }

                // Trigger spending animation (disabled in Simulation Mode)
                if (!simulationMode && inputRef.current) {
                    const rect = inputRef.current.getBoundingClientRect();
                    setShardAnim({ x: rect.right - 20, y: rect.top + 20 });
                }

                setChatHistory(prev => [...prev, { role: 'model', content: response }]);
            } catch (error) {
                console.error("Forecast Error:", error);
                setChatHistory(prev => [...prev, { role: 'model', content: `Forecast Error: ${error instanceof Error ? error.message : String(error)}` }]);
                // Don't deduct shards on error
            }
        } else {
            try {
                const response = await GeminiService.getChatResponse(userMsg, chart, chatHistory, profile || undefined, itemContext);

                // Deduct shards only on successful response (disabled in Simulation Mode)
                if (!simulationMode) {
                    onSpendShards?.(CHAT_COST);
                }

                // Trigger spending animation (disabled in Simulation Mode)
                if (!simulationMode && inputRef.current) {
                    const rect = inputRef.current.getBoundingClientRect();
                    setShardAnim({ x: rect.right - 20, y: rect.top + 20 });
                }

                setChatHistory(prev => [...prev, { role: 'model', content: response }]);
            } catch (error: any) {
                console.error("Chat Response Error:", error);
                // Check if this is a quota error and display appropriate message
                const errorMessage = error.message || "Unknown error occurred";
                setChatHistory(prev => [...prev, { role: 'model', content: `Error: ${errorMessage}` }]);
                // Don't deduct shards on error
            }
        }

        setIsTyping(false);
        const speechInterval = setInterval(() => {
            soundEngine.playSpeech();
        }, 100);
        setTimeout(() => clearInterval(speechInterval), 800);
    };

    const handleDeepAnalysis = async () => {
        if (!inputValue.trim() || !chart || isTyping) return;

        const DEEP_COST = oracleData?.dialogue_stream.unlock_cost || 0.5;
        if (!simulationMode && shards < DEEP_COST) {
            soundEngine.playClick();
            setChatHistory(prev => [...prev, { role: 'model', content: '⚠️ Insufficient Shards for Deep Analysis. Requires 0.5 ✨.' }]);
            return;
        }

        const userMsg = inputValue.trim();
        setInputValue("");
        setIsTyping(true);
        soundEngine.playStateChange(); // Deep analysis sound

        try {
            // Using the new Deep Analysis flag
            const response = await GeminiService.getChatResponse(userMsg, chart, chatHistory, profile || undefined, itemContext, true);

            if (!simulationMode) {
                onSpendShards?.(DEEP_COST);
            }

            setChatHistory(prev => [...prev, { role: 'user', content: `[DEEP ANALYSIS] ${userMsg}` }, { role: 'model', content: response }]);
        } catch (error: any) {
            setChatHistory(prev => [...prev, { role: 'model', content: `Error: ${error.message}` }]);
        }

        setIsTyping(false);
    };

    // VISUAL SYNERGY: Detect Zodiac Keywords to show background hints
    const getVisualSynergy = () => {
        if (oracleData?.active_card === 'CAPRICORN_ARTIFACT') return { icon: '/relic-capricorn.png', color: 'text-blue-500' };

        const text = displayedText.toLowerCase();
        if (text.includes('taurus')) return { icon: '/relic-taurus.png', color: 'text-emerald-500' };
        if (text.includes('capricorn')) return { icon: '/relic-capricorn.png', color: 'text-blue-500' };
        if (text.includes('virgo')) return { icon: '/relic-virgo.png', color: 'text-yellow-500' };
        return null;
    };

    const synergy = getVisualSynergy();

    return (
        <AnimatePresence mode="wait">
            {/* MINIMIZED STATE: Floating Anchor (Bottom Left) */}
            {isVisible && isMinimized && (
                <motion.div
                    key="minimized-anchor"
                    initial={{ opacity: 0, scale: 0.5, x: -50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: -50 }}
                    className="fixed bottom-4 left-4 z-[60] cursor-pointer group pointer-events-auto"
                    onClick={toggleMinimize}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-magic-gold blur-lg opacity-30 group-hover:opacity-60 rounded-full transition-opacity duration-500" />
                        <div className="bg-midnight-purple border-2 border-magic-gold rounded-full p-1 shadow-[0_0_20px_rgba(255,215,0,0.4)] relative z-10 w-16 h-16 flex items-center justify-center">
                            <AIGirlPortrait
                                outfitId={outfitId}
                                headgearId={headgearId}
                                accessoryId={accessoryId}
                                size="medium"
                                level={level}
                                isTyping={isTyping}
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* MAXIMIZED STATE: Full Screen Modal Overlay */}
            {isVisible && !isMinimized && (
                <motion.div
                    key="maximized-modal"
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(16px)", transition: { duration: 0.5 } }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.3 } }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 md:p-8 overflow-hidden pointer-events-auto"
                >
                    {/* Background Noise/Texture */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/noise.png')] mix-blend-overlay" />

                    <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-6xl mx-auto h-[85vh] relative z-10">

                        {/* LEFT COLUMN: BIG SEER PORTRAIT */}
                        <motion.div
                            initial={{ x: -100, opacity: 0, scale: 0.8 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: -100, opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            className="flex flex-col items-center justify-center relative w-full h-[35%] md:w-1/3 md:h-full order-1"
                        >
                            <div className="relative w-full h-full md:aspect-square max-w-[400px] flex items-center justify-center">
                                {/* Aura Effects */}
                                <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] animate-pulse-slow mix-blend-screen" />
                                <div className="absolute inset-0 bg-purple-600/10 blur-[80px] animate-float mix-blend-color-dodge" />

                                {/* The Portrait - Frameless Big Version */}
                                <div className="relative z-10 h-full flex items-center justify-center">
                                    <img
                                        src="/seer-stage-1.3.png"
                                        alt="The Oracle"
                                        className="h-[110%] w-auto md:w-[140%] md:h-auto max-w-none md:max-w-[600px] object-contain drop-shadow-[0_0_50px_rgba(147,51,234,0.4)] md:-ml-10"
                                    />
                                </div>
                            </div>

                            {/* Character Name / Status */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-[-40px] text-center z-20"
                            >
                                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-purple-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] font-serif tracking-widest">
                                    THE ORACLE
                                </h2>
                                <p className="text-purple-300/60 text-sm tracking-[0.3em] uppercase mt-2">
                                    Level {profile?.level || 1} • {getCurrentMoonPhase()}
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* RIGHT (CENTER) COLUMN: CHAT INTERFACE */}
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl w-full h-[65%] md:w-2/3 md:h-full flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-20 overflow-hidden order-2"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-magic-gold rounded-full animate-pulse shadow-[0_0_10px_orange]" />
                                    <h3 className="text-white/80 text-sm tracking-[0.2em] font-bold uppercase">
                                        Neural Link Established
                                    </h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Shard Balance Display */}
                                    <div
                                        onClick={() => {
                                            if (shards > 0) {
                                                setUseStarCurrency(!useStarCurrency);
                                                soundEngine.playStateChange();
                                            }
                                        }}
                                        className={`flex items-center gap-2 cursor-pointer transition-all px-3 py-1.5 rounded-full border mr-2 ${useStarCurrency
                                            ? "bg-yellow-900/40 border-yellow-400/50 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                                            : "bg-blue-900/40 border-blue-400/30 grayscale opacity-80"
                                            }`}
                                    >
                                        <Sparkles className={`w-3 h-3 ${useStarCurrency ? "text-yellow-400 animate-spin-slow" : "text-blue-300"}`} />
                                        <span className={`${useStarCurrency ? "text-yellow-100" : "text-blue-200"} font-mono text-xs font-bold`}>
                                            {useStarCurrency ? "STAR MODE" : "SHARD MODE"}
                                        </span>
                                        <div className="w-px h-3 bg-white/20 mx-1" />
                                        <span className="text-white font-mono text-xs">{shards?.toFixed(1) || 0}</span>
                                    </div>

                                    <button
                                        onClick={toggleMute}
                                        className="p-2 rounded-lg hover:bg-white/10 text-purple-300 transition-colors"
                                        title={isMuted ? "Unmute" : "Mute"}
                                    >
                                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                    </button>

                                    <button
                                        onClick={toggleMinimize}
                                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-300 border border-red-500/20 hover:border-red-500/50 transition-all"
                                        title="Close Interface"
                                    >
                                        <Minimize2 className="w-5 h-5" />
                                        {/* Using Minimize2 as 'Close' to return to anchor state */}
                                    </button>
                                </div>
                            </div>

                            {/* Chat Body */}
                            <div
                                className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar scroll-smooth"
                                ref={scrollRef}
                            >
                                {/* Synergy Background */}
                                {synergy && (
                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 blur-xl">
                                        <img src={synergy.icon} className="w-[80%] h-[80%] object-contain" />
                                    </div>
                                )}

                                {/* Initial Text */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-purple-900/30 border border-purple-500/30 p-6 rounded-2xl relative"
                                >
                                    <p className={`text-purple-100 text-lg leading-relaxed font-serif italic ${synergy ? synergy.color : ''}`}>
                                        <GlitchedText
                                            text={`"${displayedText}"`}
                                            intensity={useStarCurrency ? 0.02 : 0.3} // Star Mode = Clear, Shard Mode = Glitchy
                                            speed={useStarCurrency ? 200 : 50}
                                        />
                                    </p>
                                    <div className="absolute top-0 right-0 p-2 opacity-50">
                                        <Sparkles className="w-4 h-4 text-purple-300" />
                                    </div>
                                </motion.div>

                                {/* History */}
                                {chatHistory.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} relative z-10`}
                                    >
                                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm md:text-base leading-relaxed ${msg.role === 'user'
                                            ? 'bg-blue-600/20 border border-blue-400/30 text-blue-100 rounded-tr-none'
                                            : 'bg-indigo-600/20 border border-indigo-400/30 text-indigo-100 rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <div className="flex items-center gap-2 text-purple-300/70 p-4">
                                        <span className="text-xs uppercase tracking-widest">
                                            {useStarCurrency ? "RECEIVING CLEAR SIGNAL..." : "INTERFERENCE DETECTED..."}
                                        </span>
                                        <span className="animate-bounce">.</span>
                                        <span className="animate-bounce delay-75">.</span>
                                        <span className="animate-bounce delay-150">.</span>
                                    </div>
                                )}
                            </div>

                            {/* Footer Input */}
                            <div className="p-6 border-t border-white/10 bg-black/40 relative z-20">
                                {chart ? (
                                    <form onSubmit={handleSendMessage} className="relative max-w-3xl mx-auto w-full">
                                        <div className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                placeholder="Ask the Oracle about your destiny..."
                                                className="relative w-full bg-slate-900/90 text-white p-4 pr-14 rounded-lg border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder:text-slate-500 text-lg transition-all"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!inputValue.trim() || isTyping}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600/80 hover:bg-purple-500 text-white rounded-md transition-all shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:shadow-none"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-center text-gray-500 text-sm">Calibration Required</div>
                                )}

                                {/* Deep Analysis Quick Action */}
                                {inputValue.trim().length > 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute -top-12 left-0 right-0 flex justify-center"
                                    >
                                        <button
                                            onClick={handleDeepAnalysis}
                                            className="px-6 py-2 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/50 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-2 transition-all"
                                        >
                                            <span>⚡ Initiate Deep Analysis</span>
                                            <span className="bg-indigo-500/20 px-2 py-0.5 rounded text-white">+0.5 Shards</span>
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
