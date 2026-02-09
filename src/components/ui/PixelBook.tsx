"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import Image from "next/image";

interface PixelBookProps {
    leftContent: ReactNode;
    rightContent: ReactNode;
}

export function PixelBook({ leftContent, rightContent }: PixelBookProps) {
    return (
        <div className="relative w-full max-w-6xl aspect-[16/10] flex items-center justify-center">

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "backOut" }}
                className="relative w-full h-full"
            >
                {/* The Background Image acts as the coordinate system */}
                <Image
                    src="/ancient-open-book.png"
                    alt="The Star Archive"
                    fill
                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] pointer-events-none"
                    priority
                />

                {/* LEFT PAGE CONTENT ZONE 
                    Adjusted percentages based on the visual layout of the open book asset.
                */}
                <div
                    className="absolute top-[12%] left-[13%] width-[36%] height-[78%] overflow-hidden"
                    style={{ width: '35%', height: '76%' }}
                >
                    <div className="w-full h-full overflow-y-auto custom-scrollbar px-2 py-1 mix-blend-multiply opacity-90 text-[#2a1202] pointer-events-auto">
                        {leftContent}
                    </div>
                </div>

                {/* RIGHT PAGE CONTENT ZONE */}
                <div
                    className="absolute top-[12%] right-[11%] overflow-hidden"
                    style={{ width: '35%', height: '76%' }}
                >
                    <div className="w-full h-full flex items-center justify-center mix-blend-multiply opacity-90 text-[#2a1202] pointer-events-auto relative">
                        {rightContent}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
