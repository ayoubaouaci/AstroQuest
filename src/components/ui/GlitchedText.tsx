'use client';

import { useState, useEffect } from 'react';

interface GlitchedTextProps {
    text: string;
    intensity?: number; // 0 = Clear, 1 = Max Glitch
    speed?: number; // ms between updates
}

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function GlitchedText({ text, intensity = 0, speed = 50 }: GlitchedTextProps) {
    const [display, setDisplay] = useState(text);

    useEffect(() => {
        if (intensity <= 0) {
            setDisplay(text);
            return;
        }

        const interval = setInterval(() => {
            setDisplay(prev => {
                return text.split('').map((char, i) => {
                    if (char === ' ') return ' ';
                    // Higher intensity = higher chance of glitch
                    if (Math.random() < intensity * 0.1) {
                        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                    }
                    return char;
                }).join('');
            });
        }, speed);

        return () => clearInterval(interval);
    }, [text, intensity, speed]);

    return (
        <span className={intensity > 0.3 ? "animate-pulse" : ""}>
            {display}
        </span>
    );
}
