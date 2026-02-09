'use client';

interface CompassRingProps {
    type: 'zodiac' | 'houses';
    items: any[];
    rotation: number;
}

export default function CompassRing({ type, items, rotation }: CompassRingProps) {
    const isZodiac = type === 'zodiac';
    const radius = isZodiac ? '85%' : '65%';

    return (
        <div
            className={`compass-ring ${type}-ring`}
            style={{
                transform: `rotate(${rotation}deg)`,
                width: radius,
                height: radius
            }}
        >
            {items.map((item, index) => {
                const angle = (index * 30) - 90;

                return (
                    <div
                        key={index}
                        className={`ring-segment ${type}-segment`}
                        style={{
                            transform: `rotate(${angle}deg)`,
                            transformOrigin: 'center'
                        }}
                    >
                        <div className="segment-content">
                            {isZodiac ? (
                                <span className="zodiac-label">{item}</span>
                            ) : (
                                <div className="house-label">
                                    <span className="house-number">{item.number}</span>
                                    <span className="house-sign">{item.sign}</span>
                                    <span className="house-degree">{item.degree}</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
