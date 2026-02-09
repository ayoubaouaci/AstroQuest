'use client';

import { HouseCusp } from '@/utils/astrology/astroCalculator';

interface HouseDisplayProps {
    house: HouseCusp;
    index: number;
}

export default function HouseDisplay({ house, index }: HouseDisplayProps) {
    const angle = (house.degree + (house.minute / 60)) * 12 + (index * 30) - 90;

    return (
        <div
            className="house-line"
            style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'center bottom'
            }}
        >
            <div className="line"></div>
            <div className="house-marker">
                <span className="house-number">{house.house}</span>
                <span className="house-sign-symbol">{house.symbol}</span>
                <span className="house-degree-text">{house.degree}°{house.minute}'</span>
            </div>
        </div>
    );
}
