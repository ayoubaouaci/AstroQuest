'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/crack.css';

interface CrackOverlayProps {
    stage: 0 | 1 | 2 | 3 | 4 | 5;
    hue?: number;
    isPulsing?: boolean;
    pulseIntensity?: number;
    zodiacSymbol?: string;
}

// --- Realistic Fractal Path Data ---
// Thinner, more jagged paths for realism
const CRACK_PATHS = {
    1: [
        "M 50,50 L 51,48 L 53,46 L 55,45",
        "M 50,50 L 49,52 L 47,54 L 45,56"
    ],
    2: [
        "M 50,50 L 52,45 L 56,42 L 60,35 L 65,30",
        "M 50,50 L 45,55 L 40,58 L 35,65",
        "M 50,50 L 58,52 L 65,51 L 70,50",
    ],
    3: [
        "M 50,50 L 52,40 L 55,30 L 60,20 L 65,15",
        "M 50,50 L 45,60 L 35,70 L 25,75 L 20,80",
        "M 50,50 L 65,55 L 75,60 L 85,65",
        "M 50,50 L 35,45 L 25,35 L 15,30",
        // Micro-fractures
        "M 60,20 L 62,15 L 65,10",
        "M 35,70 L 32,75 L 30,80",
    ],
    4: [
        // Main Arteries (Jagged)
        "M 50,50 L 55,40 L 60,30 L 70,20 L 80,15",
        "M 50,50 L 45,60 L 40,70 L 30,80 L 20,85",
        "M 50,50 L 70,50 L 80,55 L 90,60",
        "M 50,50 L 30,50 L 20,45 L 10,40",
        "M 50,50 L 50,30 L 45,20 L 40,10",
        "M 50,50 L 50,70 L 55,80 L 60,90",
        // Webbing
        "M 60,30 L 65,35 L 70,40",
        "M 40,70 L 35,65 L 30,60",
    ],
    5: [
        // The Void / Portal Core (Jagged)
        "M 40,50 L 42,45 L 45,42 L 50,40 L 55,42 L 58,45 L 60,50 L 58,55 L 55,58 L 50,60 L 45,58 L 42,55 Z",
        // Radiating Fractures
        "M 50,40 L 52,30 L 55,20 L 60,10 L 65,0",
        "M 50,60 L 48,70 L 45,80 L 40,90 L 35,100",
        "M 60,50 L 70,50 L 80,45 L 90,40 L 100,35",
        "M 40,50 L 30,50 L 20,55 L 10,60 L 0,65",
        "M 55,45 L 65,35 L 75,25 L 85,15 L 95,5",
        "M 45,55 L 35,65 L 25,75 L 15,85 L 5,95",
        "M 45,45 L 35,35 L 25,25 L 15,15 L 5,5",
        "M 55,55 L 65,65 L 75,75 L 85,85 L 95,95",
    ]
};

const PARTICLE_CONFIG = {
    1: { count: 10, speed: 0.3, size: 1.0, opacity: 0.6 },
    2: { count: 25, speed: 0.5, size: 1.2, opacity: 0.7 },
    3: { count: 50, speed: 0.8, size: 1.5, opacity: 0.8 },
    4: { count: 100, speed: 1.2, size: 2.0, opacity: 0.9 },
    5: { count: 300, speed: 2.5, size: 3.0, opacity: 1.0 }
};

export default function CrackOverlay({
    stage,
    hue,
    isPulsing = false,
    pulseIntensity = 0,
    zodiacSymbol = "★"
}: CrackOverlayProps) {
    const isPortalReady = stage === 5;
    const config = PARTICLE_CONFIG[stage as keyof typeof PARTICLE_CONFIG] || PARTICLE_CONFIG[1];

    // Generate Particles (Client-Side Only to prevent Hydration Mismatch)
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        if (stage === 0) {
            setParticles([]);
            return;
        }

        const newParticles = Array.from({ length: config.count }).map((_, i) => ({
            id: i,
            x: 50 + (Math.random() - 0.5) * (stage * 15),
            y: 50 + (Math.random() - 0.5) * (stage * 15),
            angle: Math.random() * 360,
            delay: Math.random() * 2,
            duration: 1 + Math.random() * 2,
            size: config.size * (0.5 + Math.random()),
            opacity: config.opacity
        }));
        setParticles(newParticles);
    }, [stage, config]);

    const currentPaths = useMemo(() => CRACK_PATHS[stage as keyof typeof CRACK_PATHS] || [], [stage]);

    if (stage === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="crack-overlay-container absolute inset-0 pointer-events-none overflow-hidden rounded-full"
                style={{ zIndex: 20 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* 1. Procedural Noise Texture (SVG) */}
                <svg className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>

                {/* 2. Darkener for Contrast */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-purple-900/10 to-transparent opacity-50" />

                {/* 3. Screen Shake (Stage 5 Only) */}
                <motion.div
                    className="absolute inset-0"
                    animate={isPortalReady ? {
                        x: [0, -1, 1, -0.5, 0.5, 0],
                        y: [0, 0.5, -0.5, 1, -1, 0]
                    } : {}}
                    transition={{
                        duration: 0.2, // Faster, sharper shake
                        repeat: isPortalReady ? Infinity : 0,
                        repeatDelay: 3 // Occasional tremor
                    }}
                >
                    <div className="w-full h-full">
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(138,43,226,0.8)]">
                            <defs>
                                <linearGradient id="neon-crack-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#4B0082" />
                                    <stop offset="50%" stopColor="#8A2BE2" />
                                    <stop offset="100%" stopColor="#FFFFFF" />
                                </linearGradient>
                                <filter id="glow-realism" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="0.5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>

                            {/* Paths */}
                            {currentPaths.map((d, i) => (
                                <motion.path
                                    key={`path-${stage}-${i}`}
                                    d={d}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{
                                        pathLength: 1,
                                        opacity: 0.9 + (pulseIntensity * 0.1),
                                        strokeWidth: isPortalReady ? 1.5 : (0.5 + stage * 0.15) // THIN STRIPS
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        ease: "easeOut",
                                        delay: i * 0.02
                                    }}
                                    fill="none"
                                    stroke="url(#neon-crack-gradient)"
                                    strokeLinecap="round" // Jagged paths, but round caps for connectivity
                                    strokeLinejoin="round"
                                    filter="url(#glow-realism)"
                                />
                            ))}
                        </svg>
                    </div>
                </motion.div>

                {/* 4. Fine Particles */}
                <div className="particles-container absolute inset-0">
                    {particles.map((p) => (
                        <motion.div
                            key={`p-${stage}-${p.id}`}
                            className="absolute rounded-full"
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                width: p.size,
                                height: p.size,
                                background: '#FFFFFF',
                                boxShadow: '0 0 4px #8A2BE2'
                            }}
                            animate={{
                                opacity: [0, p.opacity, 0],
                                scale: [0, 1, 0],
                                y: [0, -10] // Rise slightly
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                delay: p.delay,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                {/* 5. Center Symbol (Text/Icon) */}
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <motion.div
                        className="font-serif text-white flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                            opacity: 1,
                            scale: isPortalReady && isPulsing ? [1, 1.2, 1] : 1,
                            textShadow: "0 0 15px #8A2BE2, 0 0 30px #4B0082"
                        }}
                        transition={{ duration: 0.5 }}
                        style={{ fontSize: isPortalReady ? '2.5rem' : '1.5rem' }}
                    >
                        {/* Ensure it's not a box by using span and explicitly setting content */}
                        <span className="relative z-10">{zodiacSymbol}</span>

                        {/* Back Glow for Symbol */}
                        <div className="absolute inset-0 blur-xl bg-purple-600/50 rounded-full transform scale-150 -z-10" />
                    </motion.div>
                </div>

                {/* 6. Portal Flash (Stage 5) */}
                <AnimatePresence>
                    {isPortalReady && isPulsing && (
                        <motion.div
                            className="absolute inset-0 z-40 bg-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.6, 0] }}
                            transition={{ duration: 0.15 }}
                            style={{ mixBlendMode: 'overlay' }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
}
