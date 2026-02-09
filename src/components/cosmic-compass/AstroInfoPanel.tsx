'use client';

import { AstroChart } from '@/utils/astrology/astroCalculator';
import { X } from 'lucide-react';

interface AstroInfoPanelProps {
    chart: AstroChart;
    selectedPlanet: string | null;
    onClose: () => void;
}

export default function AstroInfoPanel({ chart, selectedPlanet, onClose }: AstroInfoPanelProps) {
    if (!selectedPlanet) return null;

    const planet = chart.planets.find(p => p.planet === selectedPlanet);
    if (!planet) return null;

    return (
        <div className="astro-info-panel">
            <button className="close-btn" onClick={onClose}>
                <X size={20} />
            </button>

            <div className="panel-header">
                <span className="planet-symbol-large">{planet.symbol}</span>
                <h3>{planet.planet}</h3>
            </div>

            <div className="panel-content">
                <div className="info-row">
                    <span className="label">البرج:</span>
                    <span className="value">{planet.signSymbol} {planet.sign}</span>
                </div>

                <div className="info-row">
                    <span className="label">الدرجة:</span>
                    <span className="value">{planet.degree}° {planet.minute}'</span>
                </div>

                <div className="info-row">
                    <span className="label">البيت:</span>
                    <span className="value">{planet.house}</span>
                </div>

                <div className="info-row">
                    <span className="label">الحالة:</span>
                    <span className="value">{planet.retrograde ? 'رجعي ℞' : 'مباشر'}</span>
                </div>
            </div>

            <div className="element-balance">
                <h4>توازن العناصر</h4>
                <div className="balance-bars">
                    {Object.entries(chart.elementBalance).map(([element, count]) => (
                        <div key={element} className="balance-bar">
                            <span className="element-name">{element}</span>
                            <div className="bar-container">
                                <div
                                    className={`bar bar-${element}`}
                                    style={{ width: `${(count / 10) * 100}%` }}
                                ></div>
                            </div>
                            <span className="element-count">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
