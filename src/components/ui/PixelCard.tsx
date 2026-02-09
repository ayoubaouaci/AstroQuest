"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PixelCardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    noDecor?: boolean;
}

export function PixelCard({ children, className = "", title, noDecor = false }: PixelCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`relative bg-midnight-purple border-4 border-magic-gold p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] ${className}`}
        >
            {/* Inner Border for extra depth */}
            <div className={`h-full w-full ${noDecor ? '' : 'border-2 border-dashed border-magic-gold/50'} p-4 relative`}>
                {title && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-midnight-purple px-4 py-1 border-2 border-magic-gold text-magic-gold text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                        {title}
                    </div>
                )}
                {children}
            </div>

            {/* Decorative Corner Pixels */}
            {!noDecor && (
                <>
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-magic-gold" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-magic-gold" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-magic-gold" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-magic-gold" />
                </>
            )}
        </motion.div>
    );
}
