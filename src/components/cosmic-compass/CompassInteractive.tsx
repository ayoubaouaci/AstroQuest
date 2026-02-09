'use client';

import { useState, useEffect, useRef } from 'react';
import { AstroChart, BirthData, calculateNatalChart, generateMockChart } from '@/utils/astrology/astroCalculator';
import CompassRing from './CompassRing';
import PlanetDisplay from './PlanetDisplay';
import HouseDisplay from './HouseDisplay';
import AstroInfoPanel from './AstroInfoPanel';
import './compass-styles.css';

interface CompassInteractiveProps {
    birthData?: BirthData;
}

export default function CompassInteractive({ birthData }: CompassInteractiveProps) {
    const [chart, setChart] = useState<AstroChart | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [autoRotate, setAutoRotate] = useState(false);
    const compassRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef<{ x: number; y: number; rotation: number } | null>(null);

    useEffect(() => {
        async function loadChart() {
            try {
                if (birthData) {
                    const calculatedChart = await calculateNatalChart(birthData);
                    setChart(calculatedChart);
                } else {
                    setChart(generateMockChart());
                }
            } catch (error) {
                console.error('Error calculating chart:', error);
                setChart(generateMockChart());
            }
            setIsLoading(false);
        }

        loadChart();
    }, [birthData]);

    useEffect(() => {
        if (!autoRotate) return;

        const interval = setInterval(() => {
            setRotation(prev => (prev + 0.5) % 360);
        }, 50);

        return () => clearInterval(interval);
    }, [autoRotate]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!compassRef.current) return;

        const rect = compassRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        dragStartRef.current = {
            x: e.clientX - centerX,
            y: e.clientY - centerY,
            rotation: rotation
        };

        setIsDragging(true);
        setAutoRotate(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !compassRef.current || !dragStartRef.current) return;

        const rect = compassRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const startAngle = Math.atan2(dragStartRef.current.y, dragStartRef.current.x) * (180 / Math.PI);
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

        const deltaAngle = currentAngle - startAngle;
        setRotation((dragStartRef.current.rotation + deltaAngle + 360) % 360);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        dragStartRef.current = null;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length !== 1 || !compassRef.current) return;

        const rect = compassRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const touch = e.touches[0];

        dragStartRef.current = {
            x: touch.clientX - centerX,
            y: touch.clientY - centerY,
            rotation: rotation
        };

        setIsDragging(true);
        setAutoRotate(false);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || e.touches.length !== 1 || !compassRef.current || !dragStartRef.current) return;

        const rect = compassRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const touch = e.touches[0];

        const startAngle = Math.atan2(dragStartRef.current.y, dragStartRef.current.x) * (180 / Math.PI);
        const currentAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);

        const deltaAngle = currentAngle - startAngle;
        setRotation((dragStartRef.current.rotation + deltaAngle + 360) % 360);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        dragStartRef.current = null;
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    if (isLoading) {
        return (
            <div className="compass-loading">
                <div className="spinner"></div>
                <p>جاري حساب الخريطة الفلكية...</p>
            </div>
        );
    }

    if (!chart) {
        return <div className="error-message">خطأ في تحميل البيانات</div>;
    }

    const zodiacLabels = [
        'الحمل ♈', 'الثور ♉', 'الجوزاء ♊', 'السرطان ♋',
        'الأسد ♌', 'العذراء ♍', 'الميزان ♎', 'العقرب ♏',
        'القوس ♐', 'الجدي ♑', 'الدلو ♒', 'الحوت ♓'
    ];

    return (
        <div className="cosmic-compass-container">
            <div className="user-info-header">
                <h2>🌌 الخريطة الفلكية {birthData?.name ? `لـ ${birthData.name}` : ''}</h2>
                {birthData && (
                    <div className="birth-info">
                        <span>📅 {birthData.birthDate.toLocaleDateString('ar-EG')}</span>
                        <span>🕒 {birthData.birthTime}</span>
                        <span>📍 {birthData.birthPlace}</span>
                    </div>
                )}
            </div>

            <div
                ref={compassRef}
                className={`cosmic-compass ${isDragging ? 'dragging' : ''}`}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ transform: `scale(${zoom})` }}
            >
                <div className="compass-inner" style={{ transform: `rotate(${rotation}deg)` }}>
                    <div className="degrees-ring">
                        {Array.from({ length: 36 }).map((_, i) => (
                            <div
                                key={i}
                                className="degree-mark"
                                style={{ transform: `rotate(${i * 10}deg)` }}
                            >
                                {i % 3 === 0 && <span className="degree-number">{i * 10}°</span>}
                            </div>
                        ))}
                    </div>

                    <CompassRing type="zodiac" items={zodiacLabels} rotation={0} />
                    <CompassRing
                        type="houses"
                        items={chart.houses.map(h => ({
                            number: h.house,
                            sign: h.sign,
                            degree: `${h.degree}°${h.minute}'`
                        }))}
                        rotation={0}
                    />

                    <div className="main-axes">
                        <div className="axis horizon">
                            <div className="axis-label east">شرق</div>
                            <div className="axis-label west">غرب</div>
                        </div>
                        <div className="axis meridian">
                            <div className="axis-label north">شمال</div>
                            <div className="axis-label south">جنوب</div>
                        </div>

                        <div className="angle-points">
                            <div className="angle asc" title="الأساس (ASC)">
                                <span className="angle-symbol">AC</span>
                                <div className="angle-details">
                                    {chart.ascendant.sign} {chart.ascendant.degree}°{chart.ascendant.minute}'
                                </div>
                            </div>
                            <div className="angle mc" title="وسط السماء (MC)">
                                <span className="angle-symbol">MC</span>
                                <div className="angle-details">
                                    {chart.midheaven.sign} {chart.midheaven.degree}°{chart.midheaven.minute}'
                                </div>
                            </div>
                            <div className="angle desc" title="الغرب (DESC)">
                                <span className="angle-symbol">DC</span>
                            </div>
                            <div className="angle ic" title="قاع السماء (IC)">
                                <span className="angle-symbol">IC</span>
                            </div>
                        </div>
                    </div>

                    <div className="planets-layer">
                        {chart.planets.map((planet, index) => (
                            <PlanetDisplay
                                key={planet.planet}
                                planet={planet}
                                index={index}
                                isSelected={selectedPlanet === planet.planet}
                                onClick={() => setSelectedPlanet(planet.planet)}
                            />
                        ))}
                    </div>

                    <div className="houses-layer">
                        {chart.houses.map((house, index) => (
                            <HouseDisplay
                                key={house.house}
                                house={house}
                                index={index}
                            />
                        ))}
                    </div>

                    <div className="compass-center">
                        <div className="center-circle">
                            <div className="inner-center">
                                <span className="earth-symbol">🜨</span>
                                <div className="center-text">
                                    <div>مركز الأرض</div>
                                    {birthData && (
                                        <div className="coord">
                                            {birthData.latitude.toFixed(2)}°N<br />
                                            {birthData.longitude.toFixed(2)}°E
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid-background">
                        <div className="grid-circle"></div>
                        <div className="grid-circle"></div>
                        <div className="grid-circle"></div>
                        <div className="grid-lines">
                            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                                <div
                                    key={angle}
                                    className="grid-line"
                                    style={{ transform: `rotate(${angle}deg)` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="compass-controls">
                <div className="zoom-controls">
                    <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>➖</button>
                    <span>{(zoom * 100).toFixed(0)}%</span>
                    <button onClick={() => setZoom(Math.min(2, zoom + 0.1))}>➕</button>
                </div>
                <button
                    className="reset-btn"
                    onClick={() => {
                        setRotation(0);
                        setZoom(1);
                        setAutoRotate(false);
                    }}
                >
                    🔄 إعادة تعيين
                </button>
                <button
                    className={`auto-rotate-btn ${autoRotate ? 'active' : ''}`}
                    onClick={() => setAutoRotate(!autoRotate)}
                >
                    ⚙️ {autoRotate ? 'إيقاف الدوران' : 'دوران تلقائي'}
                </button>
            </div>

            <AstroInfoPanel
                chart={chart}
                selectedPlanet={selectedPlanet}
                onClose={() => setSelectedPlanet(null)}
            />

            <div className="mobile-quick-view">
                <div className="quick-item">
                    <span className="quick-icon">☉</span>
                    <div>
                        <div className="quick-label">الشمس</div>
                        <div className="quick-value">{chart.sunSign}</div>
                    </div>
                </div>
                <div className="quick-item">
                    <span className="quick-icon">☽</span>
                    <div>
                        <div className="quick-label">القمر</div>
                        <div className="quick-value">{chart.moonSign}</div>
                    </div>
                </div>
                <div className="quick-item">
                    <span className="quick-icon">↑</span>
                    <div>
                        <div className="quick-label">الأساس</div>
                        <div className="quick-value">{chart.ascendant.sign}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
