'use client';

import { useRef, useEffect, useState } from 'react';
import EmotionLayers from './EmotionLayers';
import CosmicParticles from './CosmicParticles';
import CrackOverlay from './CrackOverlay';
import MiracleEffect from './MiracleEffect';
import './styles/emotion.css';
import './styles/miracle.css';
import './styles/miracle.css';
import { CosmicHeartState } from '@/hooks/useCosmicHeartSystem';
import StarItem from './StarItem';

interface CosmicHeartProps {
    heartState: CosmicHeartState;
    onInteraction: () => void;
    onStarCollect?: (id: string, x: number, y: number) => void;
    zodiacSymbol?: string;
}

export function CosmicHeart({ heartState, onInteraction, onStarCollect, zodiacSymbol }: CosmicHeartProps) {
    const heartRef = useRef<HTMLDivElement>(null);

    // Click Effect
    const handleClick = () => {
        onInteraction();

        // Ripple Effect
        if (heartRef.current) {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100px;
        height: 100px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 2;
        `;

            heartRef.current.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    };

    // Echo Effect on high mood
    useEffect(() => {
        if (heartRef.current && heartState.mood > 60) {
            const echo = document.createElement('div');
            echo.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: inherit;
        border-radius: inherit;
        opacity: 0.5;
        transform: scale(1);
        animation: echo-fade 0.5s ease-out;
        pointer-events: none;
        z-index: 0;
      `;

            heartRef.current.appendChild(echo);
            setTimeout(() => echo.remove(), 500);
        }
    }, [heartState.mood]);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* The Heart Container */}
            <div
                ref={heartRef}
                className="relative w-64 h-64 cursor-pointer select-none cosmic-heart-container"
                onClick={handleClick}
                style={{
                    // Hue rotate removed for consistent palette
                    animation: `float ${3 / heartState.visualVariant.rotationSpeed}s infinite ease-in-out`
                }}
            >
                {/* Emotion Layers */}
                <EmotionLayers
                    emotionalLayer={heartState.emotionalLayer}
                    hue={heartState.visualVariant.hue}
                    pulsePattern={heartState.visualVariant.pulsePattern}
                />

                {/* Crack Overlay */}
                <CrackOverlay
                    stage={heartState.crackState.stage}
                    hue={heartState.visualVariant.hue}
                    isPulsing={heartState.crackState.isPulsing}
                    pulseIntensity={heartState.crackState.pulseIntensity}
                    zodiacSymbol={zodiacSymbol}
                />

                {/* Miracle Effect */}
                {heartState.miracleState.isActive && (
                    <MiracleEffect
                        intensity={heartState.miracleState.intensity}
                    />
                )}

                {/* Cosmic Particles (High Mood) */}
                {heartState.mood > 70 && (
                    <CosmicParticles
                        density={heartState.mood / 100}
                        hue={heartState.visualVariant.hue}
                    />
                )}

                {/* Base Core - Unified Cosmic Palette (Pink to Deep Purple) */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#FFB6C1_0%,#8A2BE2_50%,#4B0082_100%)] rounded-full opacity-90 mix-blend-normal" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(75,0,130,0.8)_0%,transparent_100%)] rounded-full mix-blend-multiply" />
            </div>

            {/* Progress Indicator */}
            <div className="absolute -bottom-10 left-0 right-0">
                <div className="flex items-center justify-center space-x-2">
                    {/* Updated to 5 stages to match new logic */}
                    {[1, 2, 3, 4, 5].map((num) => (
                        <div
                            key={num}
                            className={`w-2 h-2 rounded-full transition-all duration-500 ${heartState.crackState.stage >= num
                                ? 'bg-purple-400 shadow-[0_0_8px_#8A2BE2]'
                                : 'bg-gray-800'
                                }`}
                        />
                    ))}
                    <span className="text-white/60 text-xs ml-2 font-mono tracking-widest uppercase">
                        {heartState.crackState.stage >= 5 ? 'ECLIPSE' : `PHASE ${heartState.crackState.stage}`}
                    </span>
                </div>
            </div>

            {/* Global CSS for animations used in JS creations */}
            <style jsx global>{`
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        
        @keyframes echo-fade {
          to {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
        </div>
    );
}
