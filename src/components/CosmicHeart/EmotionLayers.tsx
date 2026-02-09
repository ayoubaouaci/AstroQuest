'use client';

import { CSSProperties } from 'react';
import './styles/emotion.css';

interface EmotionLayersProps {
    emotionalLayer: 'dormant' | 'awakened' | 'radiant' | 'ascended';
    hue: number;
    pulsePattern: 'smooth' | 'staggered' | 'wave';
}

export default function EmotionLayers({
    emotionalLayer,
    hue,
    pulsePattern
}: EmotionLayersProps) {

    const layerConfigs = {
        dormant: {
            pulseSpeed: '3s',
            glowIntensity: '0.3',
            rotationSpeed: '0.5',
            filter: 'brightness(0.7)'
        },
        awakened: {
            pulseSpeed: '1.5s',
            glowIntensity: '0.6',
            rotationSpeed: '1',
            filter: 'brightness(1)'
        },
        radiant: {
            pulseSpeed: '1s',
            glowIntensity: '0.9',
            rotationSpeed: '1.5',
            filter: 'brightness(1.3) drop-shadow(0 0 20px rgba(255,255,255,0.5))'
        },
        ascended: {
            pulseSpeed: '0.7s',
            glowIntensity: '1.2',
            rotationSpeed: '2',
            filter: 'brightness(1.6) drop-shadow(0 0 30px rgba(255,255,255,0.8))'
        }
    };

    const config = layerConfigs[emotionalLayer];

    const styles: CSSProperties = {
        '--hue-rotate': `${hue}deg`,
        '--pulse-speed': config.pulseSpeed,
        '--glow-intensity': config.glowIntensity,
        '--rotation-speed': config.rotationSpeed,
        '--filter-effect': config.filter,
        '--pulse-pattern': pulsePattern
    } as React.CSSProperties; // Assert as CSSProperties to allow custom props

    return (
        <div className="emotion-layers" style={styles}>
            {/* Base Pulse */}
            <div className="emotion-layer base-pulse" />

            {/* Aura */}
            <div className="emotion-layer aura" />

            {/* Inner Glow */}
            <div className="emotion-layer inner-glow" />

            {/* Special Layer: Rays */}
            {emotionalLayer === 'radiant' && (
                <div className="special-layer rays emotion-layer" />
            )}

            {/* Special Layer: Ascended */}
            {emotionalLayer === 'ascended' && (
                <>
                    <div className="special-layer cosmic-rings emotion-layer" />
                    <div className="special-layer star-dust emotion-layer" />
                </>
            )}
        </div>
    );
}
