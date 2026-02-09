"use client";

import { PlanetConfig } from "@/lib/planets";
import { motion } from "framer-motion";

interface ProceduralPlanetProps {
    planet: PlanetConfig;
    size?: number;
}

export function ProceduralPlanet({ planet, size = 300 }: ProceduralPlanetProps) {
    const { colors, type, orbitSpeed } = planet;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* ATMOSPHERE GLOW */}
            <motion.div
                animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 rounded-full blur-xl mix-blend-screen"
                style={{ backgroundColor: colors.atmosphere }}
            />

            {/* SVG ENGINE */}
            <motion.svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: orbitSpeed, repeat: Infinity, ease: "linear" }}
            >
                <defs>
                    {/* Pixel Filter */}
                    <filter id="pixelate" x="0%" y="0%" width="100%" height="100%">
                        <feFlood x="2" y="2" height="2" width="2" />
                        <feComposite width="4" height="4" />
                        <feTile result="a" />
                        <feComposite in="SourceGraphic" in2="a" operator="in" />
                        <feMorphology operator="dilate" radius="1" />
                    </filter>

                    {/* Gradients */}
                    <radialGradient id={`grad-${planet.id}`} cx="30%" cy="30%" r="70%">
                        <stop offset="0%" stopColor={colors.secondary} />
                        <stop offset="60%" stopColor={colors.primary} />
                        <stop offset="100%" stopColor="#000" />
                    </radialGradient>
                </defs>

                {/* PLANET BASE */}
                <circle cx="50" cy="50" r="48" fill={`url(#grad-${planet.id})`} />

                {/* SURFACE FEATURES */}
                {type === 'terrestrial' && (
                    <g fill={colors.crater} opacity="0.4">
                        <circle cx="30" cy="40" r="8" />
                        <circle cx="70" cy="60" r="5" />
                        <circle cx="50" cy="20" r="3" />
                        <path d="M 20 60 Q 40 80 60 70 T 90 60" stroke={colors.crater} strokeWidth="3" fill="none" />
                    </g>
                )}

                {type === 'ruin' && (
                    <g stroke={colors.crater} strokeWidth="2" fill="none">
                        <path d="M 50 2 L 50 98" opacity="0.5" />
                        <path d="M 2 50 L 98 50" opacity="0.5" />
                        <path d="M 30 30 L 70 70" opacity="0.3" />
                        <path d="M 70 30 L 30 70" opacity="0.3" />
                        <circle cx="50" cy="50" r="20" stroke={colors.atmosphere} strokeWidth="1" fill="none" className="animate-pulse" />
                    </g>
                )}

                {type === 'void' && (
                    <g>
                        <circle cx="50" cy="50" r="25" fill="#000" />
                        <path d="M 50 10 Q 70 30 50 50 T 50 90" stroke={colors.secondary} strokeWidth="2" fill="none" className="animate-pulse" />
                        <path d="M 10 50 Q 30 70 50 50 T 90 50" stroke={colors.secondary} strokeWidth="2" fill="none" className="animate-pulse" />
                    </g>
                )}

                {/* SHADOW OVERLAY */}
                <circle cx="50" cy="50" r="48" fill="url(#shadow)" opacity="0.4" style={{ mixBlendMode: 'multiply' }} />

                {/* SCANLINES */}
                <path d="M0 20 H100 M0 40 H100 M0 60 H100 M0 80 H100" stroke="black" strokeWidth="0.5" opacity="0.2" />
            </motion.svg>
        </div>
    );
}
