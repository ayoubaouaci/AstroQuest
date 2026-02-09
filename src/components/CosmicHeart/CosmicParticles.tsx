'use client';

import { motion } from 'framer-motion';

interface CosmicParticlesProps {
    density: number;
    hue: number;
}

export default function CosmicParticles({ density, hue }: CosmicParticlesProps) {
    // Density determines the number of particles (0.0 to 1.0)
    const particleCount = Math.floor(density * 20) + 5;

    return (
        <div className="absolute inset-0 z-20 pointer-events-none">
            {[...Array(particleCount)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        backgroundColor: `hsl(${hue}, 100%, 80%)`,
                        width: Math.random() * 3 + 1,
                        height: Math.random() * 3 + 1,
                        top: '50%',
                        left: '50%',
                        boxShadow: `0 0 5px hsl(${hue}, 100%, 50%)`
                    }}
                    animate={{
                        x: (Math.random() - 0.5) * 200,
                        y: (Math.random() - 0.5) * 200,
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                    }}
                    transition={{
                        duration: Math.random() * 2 + 1,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeOut"
                    }}
                />
            ))}
        </div>
    );
}
