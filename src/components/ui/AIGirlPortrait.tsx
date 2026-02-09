"use client";

import { motion } from "framer-motion";
import { Relic } from "@/lib/cosmic-brain/relic-system";
import Image from "next/image";
import { StellarParticles } from "./StellarParticles";

export interface AIGirlPortraitProps {
    outfitId?: string;
    headgearId?: string;
    accessoryId?: string;
    size?: 'small' | 'medium' | 'large' | 'xl';
    level?: number;
    isTyping?: boolean;
}

export function AIGirlPortrait({ outfitId, headgearId, accessoryId, size = 'medium', level = 1, isTyping = false }: AIGirlPortraitProps) {
    const sizeClasses = {
        small: 'w-12 h-12',
        medium: 'w-16 h-16',
        large: 'w-24 h-24',
        xl: 'w-32 h-32',
    };

    const pixelSize = {
        small: 48,
        medium: 64,
        large: 96,
        xl: 128,
    };

    // Determine colors based on equipped items (This would ideally come from a helper lookup)
    const getOutfitColor = (id?: string) => {
        // if (id === 'ancient-galaxy-robe') return 'hue-rotate-[270deg] brightness-75'; // REMOVED - Using direct asset now
        if (id === 'nebula-initiate') return ''; // Use original image coloring
        return ''; // Default
    };

    const getAccessoryOverlay = () => {
        if (headgearId === 'silver-tiara') return (
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-1/2 h-1/4 bg-gradient-to-b from-gray-200 to-transparent opacity-80 rounded-t-full pointer-events-none mix-blend-overlay" />
        );
        return null;
    };

    // STAGE LOGIC: The Four Stages of the Seeress (New Assets)
    const getSeerImage = (lvl: number, outfit?: string) => {
        if (lvl >= 15) return "/seer-stage-4.png"; // Master Oracle
        if (lvl >= 10) return "/seer-stage-3.png"; // Celestial Adept
        if (lvl >= 5) return "/seer-stage-2.png";  // Star-Seeker

        // Legendary Ancient Galaxy Robe matches Stage 4 aesthetic (Only if level didn't catch it?)
        if (outfit === 'ancient-galaxy-robe') return "/seer-stage-4.png";

        return "/seer-stage-1.png"; // Veiled Novice
    };

    const seerImage = getSeerImage(level, outfitId);
    console.log(`[AIGirlPortrait] Level: ${level}, Outfit: ${outfitId}, Image: ${seerImage}`);

    return (
        <div className={`relative ${sizeClasses[size]} shrink-0 transition-all duration-300`}>
            {/* Main Portrait Container */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                className={`${sizeClasses[size]} rounded-full border-2 border-magic-gold shadow-[0_0_15px_rgba(255,215,0,0.5)] flex items-center justify-center relative overflow-hidden bg-midnight-purple ${outfitId === 'nebula-initiate' ? 'animate-divine-pulse' : ''}`}
                style={{ overflow: 'hidden' }}
            >
                {/* Dynamic Layers */}
                <div className={`relative w-full h-full ${getOutfitColor(outfitId)} ${outfitId === 'nebula-initiate' ? 'animate-divine-float bg-radial-at-c from-purple-900 to-black' : ''}`}>
                    <Image
                        src={seerImage}
                        alt="Seer Portrait"
                        width={pixelSize[size]}
                        height={pixelSize[size]}
                        className={`object-cover scale-125 translate-y-1 transition-all duration-700`}
                        style={{ imageRendering: 'pixelated' }}
                    />
                </div>

                {/* Glitch Overlay (Active when NOT Typing) */}
                {!isTyping && (
                    <div className="absolute inset-0 z-10 pointer-events-none mix-blend-hard-light opacity-30 bg-[url('/noise.png')] animate-pulse"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 4px, #000 4px)',
                            backgroundSize: '100% 4px'
                        }}
                    />
                )}

                {/* Headgear Layer */}
                {getAccessoryOverlay()}

                {/* Cosmic Particles Override */}
                <div className="absolute inset-0 z-20 pointer-events-none opacity-50">
                    <StellarParticles />
                </div>
            </motion.div>

            {/* Sparkle Effect for Legendaries */}
            {outfitId === 'ancient-galaxy-robe' && (
                <motion.div
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 180],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                    }}
                    className="absolute inset-0 rounded-full border border-purple-500/50 pointer-events-none"
                    style={{ boxShadow: '0 0 20px rgba(75, 0, 130, 0.5)' }}
                />
            )}
        </div>
    );
}
