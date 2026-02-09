'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import './styles/miracle.css';

interface StarItemProps {
    id: string;
    x: number;
    y: number;
    onCollect: (id: string, x: number, y: number) => void;
}

export default function StarItem({ id, x, y, onCollect }: StarItemProps) {
    const [isCollecting, setIsCollecting] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isCollecting) return;
        setIsCollecting(true);
        // onCollect will be called after animation completes
    };

    // Flying towards the QuestLog/Profile area (usually top right)
    const collectAnimation = {
        scale: [1, 1.5, 0],
        x: "40vw", // Fly right
        y: "-40vh", // Fly up
        opacity: [1, 1, 0],
        rotate: 360,
        transition: { duration: 0.8, ease: "easeInOut" }
    };

    return (
        <motion.div
            className="absolute cursor-pointer z-[50]"
            style={{
                left: `${x}%`,
                top: `${y}%`,
            }}
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={isCollecting ? collectAnimation : {
                scale: 1,
                opacity: 1,
                rotate: 0,
                y: [0, -10, 0]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
                y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                default: { type: "spring", stiffness: 200 }
            }}
            onClick={handleClick}
            onAnimationComplete={() => {
                if (isCollecting) {
                    onCollect(id, 0, 0);
                }
            }}
            whileHover={{ scale: 1.2, filter: "brightness(1.5)" }}
            whileTap={{ scale: 0.9 }}
        >
            <div className="relative w-8 h-8 flex items-center justify-center">
                {/* Glow */}
                <div className="absolute inset-0 bg-yellow-400 blur-md opacity-60 rounded-full animate-pulse" />

                {/* Star Shape */}
                <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full text-yellow-300 drop-shadow-[0_0_5px_rgba(255,215,0,0.8)]"
                    fill="currentColor"
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>

                {/* Sparkles */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
        </motion.div>
    );
}
