'use client';

import { PlanetPosition } from '@/utils/astrology/astroCalculator';

interface PlanetDisplayProps {
    planet: PlanetPosition;
    index: number;
    isSelected: boolean;
    onClick: () => void;
}

const PLANET_COLORS: Record<string, string> = {
    'Sun': '#FFD700',
    'Moon': '#C0C0C0',
    'Mercury': '#A9A9A9',
    'Venus': '#FFC0CB',
    'Mars': '#FF4500',
    'Jupiter': '#FFA500',
    'Saturn': '#F4A460',
    'Uranus': '#40E0D0',
    'Neptune': '#4169E1',
    'Pluto': '#8B0000',
};

export default function PlanetDisplay({ planet, index, isSelected, onClick }: PlanetDisplayProps) {
    const totalDegree = (planet.degree + (planet.minute / 60)) + (index * 30);
    const angle = totalDegree - 90;
    const radius = 35 + (index * 2);

    const color = PLANET_COLORS[planet.planet] || '#FFFFFF';

    return (
        <div
            className={`planet-point ${isSelected ? 'selected' : ''}`}
            style={{
                transform: `rotate(${angle}deg) translateY(-${radius}%)`,
                transformOrigin: 'center',
                color: color
            }}
            onClick={onClick}
            title={`${planet.planet} في ${planet.sign} ${planet.degree}°${planet.minute}'`}
        >
            <div className="planet-symbol" style={{ borderColor: color, boxShadow: `0 0 15px ${color}` }}>
                {planet.symbol}
                {planet.retrograde && <span className="retrograde-mark">℞</span>}
            </div>
            <div className="planet-info">
                <span className="planet-name">{planet.planet}</span>
                <span className="planet-position">{planet.degree}°{planet.minute}'</span>
            </div>
        </div>
    );
}
