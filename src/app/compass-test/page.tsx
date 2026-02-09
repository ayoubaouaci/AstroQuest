'use client';

import CompassInteractive from '@/components/cosmic-compass/CompassInteractive';
import { BirthData } from '@/utils/astrology/astroCalculator';

export default function CompassTestPage() {
    // Example birth data - replace with actual user data
    const exampleBirthData: BirthData = {
        name: "أيوب",
        birthDate: new Date('1995-06-15'),
        birthTime: "14:30",
        birthPlace: "القاهرة، مصر",
        latitude: 30.0444,
        longitude: 31.2357
    };

    return (
        <div className="min-h-screen">
            <CompassInteractive birthData={exampleBirthData} />
        </div>
    );
}
