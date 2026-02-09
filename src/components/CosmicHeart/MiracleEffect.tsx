'use client';

import { CSSProperties, useEffect, useState } from 'react';
import './styles/miracle.css';

interface MiracleEffectProps {
    intensity?: number; // 0-1
    duration?: number; // ms
    onComplete?: () => void;
}

export default function MiracleEffect({
    intensity = 1,
    duration = 10000,
    onComplete
}: MiracleEffectProps) {
    const [isActive, setIsActive] = useState(true);
    const [phase, setPhase] = useState<'enter' | 'main' | 'exit'>('enter');

    useEffect(() => {
        // Enter phase
        const enterTimer = setTimeout(() => setPhase('main'), 500);

        // Main duration
        const mainTimer = setTimeout(() => setPhase('exit'), duration - 1000);

        // Exit
        const exitTimer = setTimeout(() => {
            setIsActive(false);
            onComplete?.();
        }, duration);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(mainTimer);
            clearTimeout(exitTimer);
        };
    }, [duration, onComplete]);

    if (!isActive) return null;

    const styles = {
        '--miracle-intensity': intensity,
        '--phase': phase === 'enter' ? 0 : phase === 'main' ? 1 : 0
    } as React.CSSProperties;

    return (
        <div className="miracle-effect" style={styles}>
            {/* Flash */}
            <div className="miracle-flash" />

            {/* Aura */}
            <div className="miracle-aura" />

            {/* Concentric Rings */}
            <div className="concentric-rings">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="ring"
                        style={{ animationDelay: `${i * 0.3}s` }}
                    />
                ))}
            </div>

            {/* Star Particles */}
            <div className="star-particles">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="star-particle"
                        style={{
                            '--star-angle': `${(i * 24)}deg`,
                            '--star-distance': `${20 + (i % 3) * 15}px`,
                            animationDelay: `${i * 0.1}s`
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            {/* Inner Symbol */}
            <div className="inner-symbol">
                <div className="star-icon">✦</div>
            </div>

            {/* Energy Waves */}
            <div className="energy-waves">
                {[...Array(2)].map((_, i) => (
                    <div
                        key={i}
                        className="energy-wave"
                        style={{ animationDelay: `${i * 0.8}s` }}
                    />
                ))}
            </div>
        </div>
    );
}
