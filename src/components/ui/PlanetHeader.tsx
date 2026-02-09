"use client";

import { PlanetConfig } from "@/lib/planets";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Skull } from "lucide-react";

interface PlanetHeaderProps {
    planet: PlanetConfig;
}

export function PlanetHeader({ planet }: PlanetHeaderProps) {
    const getDangerIcon = () => {
        switch (planet.danger) {
            case 'safe': return <Shield className="w-4 h-4 text-green-400" />;
            case 'risky': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            case 'critical': return <Skull className="w-4 h-4 text-red-500 animate-pulse" />;
        }
    };

    const getDangerColor = () => {
        switch (planet.danger) {
            case 'safe': return 'text-green-400';
            case 'risky': return 'text-yellow-400';
            case 'critical': return 'text-red-500';
        }
    };

    return (
        <motion.div
            key={planet.id}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-0 left-0 right-0 z-40 p-4 pointer-events-none flex justify-center"
        >
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-3 min-w-[300px] flex flex-col items-center shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                {/* PLANET NAME */}
                <h1 className="font-pixel text-xl uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 drop-shadow-sm mb-1">
                    {planet.name}
                </h1>

                {/* STATS ROW */}
                <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-white/70">
                    <div className="flex items-center gap-2">
                        <span>LVL {planet.levelReq}</span>
                    </div>
                    <div className="w-[1px] h-3 bg-white/20" />
                    <div className={`flex items-center gap-2 ${getDangerColor()}`}>
                        {getDangerIcon()}
                        <span className="font-bold">{planet.danger.toUpperCase()}</span>
                    </div>
                </div>

                {/* DECORATIVE LINES */}
                <div className="absolute top-0 left-4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                <div className="absolute top-0 right-4 w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </div>
        </motion.div>
    );
}
