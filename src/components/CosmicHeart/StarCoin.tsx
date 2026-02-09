'use client';

import { CSSProperties, useEffect, useState } from 'react';
import './StarCoin.css';

interface StarCoinProps {
    id?: string;
    value: 1 | 3 | 5;
    position: { x: number; y: number };
    onCollect?: (value: number) => void;
    lifetime?: number; // milliseconds
}

export default function StarCoin({
    id,
    value,
    position,
    onCollect,
    lifetime = 30000
}: StarCoinProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isCollecting, setIsCollecting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [pulsePhase, setPulsePhase] = useState(0);
    const [timeLeft, setTimeLeft] = useState(lifetime);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);

    // Time tracking
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1000) {
                    setIsVisible(false);
                    return 0;
                }
                return prev - 1000;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Pulse animation
    useEffect(() => {
        const interval = setInterval(() => {
            setPulsePhase(prev => (prev + 1) % 60);
            setRotation(prev => (prev + 0.5) % 360);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Fade out effect before disappearing
    useEffect(() => {
        if (timeLeft < 5000) {
            const fadeTimer = setInterval(() => {
                setScale(prev => Math.max(0.5, prev - 0.05));
            }, 1000);
            return () => clearInterval(fadeTimer);
        }
    }, [timeLeft]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent heart interaction when clicking star
        if (!isCollecting) {
            setIsCollecting(true);

            // Collection effect
            setTimeout(() => {
                setIsVisible(false);
                onCollect?.(value);
            }, 500);
        }
    };

    if (!isVisible) return null;

    const coinConfig = {
        1: { size: 24, glow: 12, points: 5, color: 'gold' },
        3: { size: 32, glow: 20, points: 6, color: 'orange' },
        5: { size: 40, glow: 30, points: 8, color: 'hotpink' }
    };

    // Safe fallback for invalid values
    const config = coinConfig[value] || coinConfig[1];
    const pulse = Math.sin(pulsePhase * 0.1) * 0.15 + 1;
    const glowIntensity = pulse * (timeLeft / lifetime);

    const styles: CSSProperties = {
        '--star-size': `${config.size}px`,
        '--star-glow': `${config.glow * glowIntensity}px`,
        '--star-color': config.color,
        '--pulse-scale': pulse,
        '--hover-scale': isHovered ? 1.4 : 1,
        '--collect-scale': isCollecting ? 0 : scale,
        '--rotation': `${rotation}deg`,
        '--time-left': `${timeLeft / lifetime * 100}%`,
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) scale(var(--collect-scale)) rotate(var(--rotation))`,
        cursor: 'pointer',
        opacity: isCollecting ? 0.5 : 1
    } as CSSProperties;

    return (
        <div
            className={`star-coin ${isCollecting ? 'collecting' : ''}`}
            style={styles}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={`Collect ${value} stars`}
            data-star-value={value}
            data-star-id={id}
        >
            {/* Circle Timer */}
            <div className="star-timer">
                <svg className="timer-svg" viewBox="0 0 36 36">
                    <path
                        className="timer-bg"
                        d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="2"
                    />
                    <path
                        className="timer-progress"
                        d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        strokeDasharray="100"
                        strokeDashoffset={100 - (timeLeft / lifetime * 100)}
                    />
                </svg>
            </div>

            {/* Core Star */}
            <div className="star-core">
                {Array.from({ length: config.points }).map((_, i) => {
                    const angle = (i * (360 / config.points));
                    return (
                        <div
                            key={i}
                            className="star-ray"
                            style={{
                                transform: `rotate(${angle}deg)`,
                                '--ray-length': `${config.size * 0.5}px`
                            } as CSSProperties}
                        >
                            <div className="ray-inner" />
                            <div className="ray-outer" />
                        </div>
                    );
                })}

                {/* Center */}
                <div className="star-center">
                    <div className="center-glow" />
                    <span className="star-value">{value}</span>
                </div>
            </div>

            {/* Halo */}
            <div className="star-halo" />

            {/* Sparks */}
            <div className="star-sparks">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="spark"
                        style={{
                            transform: `rotate(${i * 30}deg)`,
                            animationDelay: `${i * 0.2}s`
                        }}
                    />
                ))}
            </div>

            {/* Collection Effect */}
            {isCollecting && (
                <div className="collect-effect">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="collect-particle"
                            style={{
                                '--particle-angle': `${i * 45}deg`
                            } as CSSProperties}
                        />
                    ))}
                </div>
            )}

            {/* Tooltip */}
            <div className={`star-tooltip ${isHovered ? 'visible' : ''}`}>
                <span className="tooltip-text">Click to collect</span>
                <span className="tooltip-value">+{value} ⭐</span>
            </div>
        </div>
    );
}
