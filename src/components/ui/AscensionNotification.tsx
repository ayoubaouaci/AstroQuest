"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { soundEngine } from "@/lib/sounds";
import { useEffect, useState } from "react";

interface AscensionNotificationProps {
    level: number;
    userName?: string;
    onClose: () => void;
}

export function AscensionNotification({ level, userName, onClose }: AscensionNotificationProps) {
    const [isDissolving, setIsDissolving] = useState(false);

    const safeUserName = userName || 'Traveler';

    // Narrative Logic: Header Text
    const headerTitle = level === 1 ? "THE SEER HAS AWAKENED" : "THE SEER HAS EVOLVED";

    // Narrative Logic: Dynamic Greetings
    let greeting = `Welcome, Master ${safeUserName}... I have been waiting for your arrival in this fragmented cosmos.`;
    if (level === 1) {
        greeting = `I have awakened to serve you, Master ${safeUserName}...`;
    } else if (level >= 5) {
        greeting = `My vision clears... our bond strengthens, Master ${safeUserName}.`;
    }

    // Determine Stage Info w/ Controlled Lighting (Reduced spread to prevent overflow)
    let stageInfo = {
        title: "THE VEILED NOVICE",
        img: "/seer-stage-1.1.png",
        color: "text-[#00FFA3]",
        glow: "drop-shadow-[0_0_15px_rgba(0,255,163,0.6)]",
        btnBorder: "border-[#00FFA3]",
        btnGlow: "shadow-[0_0_15px_rgba(0,255,163,0.4)]",
        message: greeting
    };

    if (level >= 15) {
        stageInfo = {
            title: "THE MASTER ORACLE",
            img: "/seer-stage-4.1.png",
            color: "text-purple-300",
            glow: "drop-shadow-[0_0_20px_rgba(168,85,247,0.7)]",
            btnBorder: "border-purple-400",
            btnGlow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
            message: `The Archive is fully unlocked. I am one with the Cosmos, Master ${safeUserName}.`
        };
    } else if (level >= 10) {
        stageInfo = {
            title: "THE CELESTIAL ADEPT",
            img: "/seer-stage-3.1.png",
            color: "text-cyan-300",
            glow: "drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]",
            btnBorder: "border-cyan-400",
            btnGlow: "shadow-[0_0_20px_rgba(34,211,238,0.4)]",
            message: `Planetary alignment synchronized. My vision extends beyond the stars, Master ${safeUserName}.`
        };
    } else if (level >= 5) {
        stageInfo = {
            title: "THE STAR-SEEKER",
            img: "/seer-stage-2.1.png",
            color: "text-blue-300",
            glow: "drop-shadow-[0_0_20px_rgba(96,165,250,0.7)]",
            btnBorder: "border-blue-400",
            btnGlow: "shadow-[0_0_20px_rgba(96,165,250,0.4)]",
            message: `My vision clears... our bond strengthens, Master ${safeUserName}.`
        };
    } else {
        stageInfo.message = `I have awakened to serve you, Master ${safeUserName}...`;
    }

    const handleDismiss = () => {
        setIsDissolving(true);
        soundEngine.playStateChange();
        setTimeout(onClose, 1000);
    };

    useEffect(() => {
        if (!isDissolving) {
            soundEngine.playLevelUp();
        }
        // Prevent background scrolling while modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isDissolving]);

    // Star Flicker
    const starFlicker = {
        animate: { opacity: [0.3, 1, 0.3, 0.7, 0.2, 1] },
        transition: { duration: 4, repeat: Infinity, ease: "linear" }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isDissolving ? 0 : 1 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 overflow-hidden" // Locked overflow
        >
            <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={isDissolving ? { scale: 2, opacity: 0, filter: "brightness(3) blur(20px)" } : { scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="flex flex-col items-center justify-center w-full max-w-sm min-h-screen py-8 space-y-6" // Reduced max-w
            >
                {/* Header - Scaled Down */}
                {!isDissolving && (
                    <div className="flex items-center gap-2 text-magic-gold text-xs tracking-[0.15em] font-bold uppercase drop-shadow-[0_0_8px_rgba(255,215,0,0.5)] text-center px-4">
                        <motion.span variants={starFlicker} animate="animate">✦</motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {headerTitle}
                        </motion.span>
                        <motion.span variants={starFlicker} animate="animate">✦</motion.span>
                    </div>
                )}

                {/* Card Display - Centered, Reduced Glow Spread */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`relative w-[80vw] max-w-[280px]`} // Reduced width
                >
                    <motion.div
                        // Tighter breathing (max 25px instead of 40px to prevent overflow)
                        animate={{
                            filter: level === 1
                                ? ["drop-shadow(0 0 10px rgba(0,255,163,0.4))", "drop-shadow(0 0 25px rgba(0,255,163,0.7))", "drop-shadow(0 0 10px rgba(0,255,163,0.4))"]
                                : ["drop-shadow(0 0 10px rgba(100,200,255,0.4))", "drop-shadow(0 0 25px rgba(100,200,255,0.7))", "drop-shadow(0 0 10px rgba(100,200,255,0.4))"]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-full"
                    >
                        <Image
                            src={stageInfo.img}
                            alt={stageInfo.title}
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: '100%', height: 'auto' }}
                            className="object-contain"
                        />
                    </motion.div>
                </motion.div>

                {/* Dialogue - Better Padding */}
                {!isDissolving && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ delay: 0.5, duration: 3, repeat: Infinity }}
                        className="text-center px-6 w-full max-w-xs" // Increased padding
                    >
                        <p className={`font-pixel text-xs ${stageInfo.color} leading-loose drop-shadow-sm`}> {/* Scaled font */}
                            "{stageInfo.message}"
                        </p>
                        {level !== 1 && (
                            <p className="text-gray-500 text-[9px] mt-4 font-mono">
                                System synchronized.
                            </p>
                        )}
                    </motion.div>
                )}

                {/* Button - Scaled Down */}
                {!isDissolving && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        onClick={handleDismiss}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-3 bg-black/80 border ${stageInfo.btnBorder} rounded-lg font-pixel text-xs uppercase tracking-widest hover:bg-white/10 transition-all ${stageInfo.btnGlow} text-gray-100 animate-pulse`}
                    >
                        {level === 1 ? "AWAKEN" : "ASCEND"}
                    </motion.button>
                )}
            </motion.div>
        </motion.div>
    );
}
