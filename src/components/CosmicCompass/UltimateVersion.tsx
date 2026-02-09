'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Body, Observer, Equator, Ecliptic, MakeTime } from 'astronomy-engine';

// Function to calculate zodiac sign from birth date
const getZodiacSign = (birthDate: string): {
    sign: string;
    symbol: string;
    element: string;
    dates: string;
    personality: string[];
    compatibleWith: string[];
    incompatibleWith: string[];
} => {
    // Parse YYYY-MM-DD manually to avoid timezone shifts (Hydration Fix)
    const [year, m, d] = birthDate.split('-').map(Number);
    const month = m;
    const day = d;


    const zodiacData = {
        aries: {
            sign: 'Aries', symbol: '♈', element: 'Fire', dates: 'Mar 21 - Apr 19',
            personality: ['Courageous', 'Determined', 'Confident', 'Enthusiastic'],
            compatibleWith: ['Leo', 'Sagittarius', 'Gemini'],
            incompatibleWith: ['Cancer', 'Capricorn']
        },
        taurus: {
            sign: 'Taurus', symbol: '♉', element: 'Earth', dates: 'Apr 20 - May 20',
            personality: ['Reliable', 'Patient', 'Practical', 'Devoted'],
            compatibleWith: ['Virgo', 'Capricorn', 'Cancer'],
            incompatibleWith: ['Leo', 'Aquarius']
        },
        gemini: {
            sign: 'Gemini', symbol: '♊', element: 'Air', dates: 'May 21 - Jun 20',
            personality: ['Gentle', 'Affectionate', 'Curious', 'Adaptable'],
            compatibleWith: ['Libra', 'Aquarius', 'Aries'],
            incompatibleWith: ['Virgo', 'Pisces']
        },
        cancer: {
            sign: 'Cancer', symbol: '♋', element: 'Water', dates: 'Jun 21 - Jul 22',
            personality: ['Loyal', 'Emotional', 'Sympathetic', 'Persuasive'],
            compatibleWith: ['Scorpio', 'Pisces', 'Taurus'],
            incompatibleWith: ['Aries', 'Libra']
        },
        leo: {
            sign: 'Leo', symbol: '♌', element: 'Fire', dates: 'Jul 23 - Aug 22',
            personality: ['Creative', 'Passionate', 'Generous', 'Cheerful'],
            compatibleWith: ['Aries', 'Sagittarius', 'Gemini'],
            incompatibleWith: ['Taurus', 'Scorpio']
        },
        virgo: {
            sign: 'Virgo', symbol: '♍', element: 'Earth', dates: 'Aug 23 - Sep 22',
            personality: ['Loyal', 'Analytical', 'Kind', 'Hardworking'],
            compatibleWith: ['Taurus', 'Capricorn', 'Cancer'],
            incompatibleWith: ['Gemini', 'Sagittarius']
        },
        libra: {
            sign: 'Libra', symbol: '♎', element: 'Air', dates: 'Sep 23 - Oct 22',
            personality: ['Cooperative', 'Diplomatic', 'Gracious', 'Fair-minded'],
            compatibleWith: ['Gemini', 'Aquarius', 'Leo'],
            incompatibleWith: ['Cancer', 'Capricorn']
        },
        scorpio: {
            sign: 'Scorpio', symbol: '♏', element: 'Water', dates: 'Oct 23 - Nov 21',
            personality: ['Brave', 'Passionate', 'Stubborn', 'Loyal'],
            compatibleWith: ['Cancer', 'Pisces', 'Virgo'],
            incompatibleWith: ['Leo', 'Aquarius']
        },
        sagittarius: {
            sign: 'Sagittarius', symbol: '♐', element: 'Fire', dates: 'Nov 22 - Dec 21',
            personality: ['Generous', 'Idealistic', 'Great sense of humor'],
            compatibleWith: ['Aries', 'Leo', 'Aquarius'],
            incompatibleWith: ['Virgo', 'Pisces']
        },
        capricorn: {
            sign: 'Capricorn', symbol: '♑', element: 'Earth', dates: 'Dec 22 - Jan 19',
            personality: ['Responsible', 'Disciplined', 'Self-controlled', 'Good managers'],
            compatibleWith: ['Taurus', 'Virgo', 'Pisces'],
            incompatibleWith: ['Aries', 'Libra']
        },
        aquarius: {
            sign: 'Aquarius', symbol: '♒', element: 'Air', dates: 'Jan 20 - Feb 18',
            personality: ['Progressive', 'Original', 'Independent', 'Humanitarian'],
            compatibleWith: ['Gemini', 'Libra', 'Sagittarius'],
            incompatibleWith: ['Taurus', 'Scorpio']
        },
        pisces: {
            sign: 'Pisces', symbol: '♓', element: 'Water', dates: 'Feb 19 - Mar 20',
            personality: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle'],
            compatibleWith: ['Cancer', 'Scorpio', 'Capricorn'],
            incompatibleWith: ['Gemini', 'Sagittarius']
        }
    };

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacData.aries;
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacData.taurus;
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacData.gemini;
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacData.cancer;
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacData.leo;
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacData.virgo;
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacData.libra;
    // Helper to get Zodiac Sign from Ecliptic Longitude
    const getSignFromLongitude = (longitude: number) => {
        const signs = [
            "Aries", "Taurus", "Gemini", "Cancer",
            "Leo", "Virgo", "Libra", "Scorpio",
            "Sagittarius", "Capricorn", "Aquarius", "Pisces"
        ];
        const index = Math.floor(longitude / 30) % 12;
        return {
            sign: signs[index],
            degree: Math.floor(longitude % 30)
        };
    };




    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacData.sagittarius;
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacData.capricorn;
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacData.aquarius;
    return zodiacData.pisces;
};

// Calculate Natal Positions using Astronomy Engine
const calculateNatalPositions = (date: Date) => {
    // Default to noon UTC if time not provided
    const observer = new Observer(0, 0, 0); // Geocentric
    const time = MakeTime(date);

    const planets = [
        { name: 'Sun', body: Body.Sun },
        { name: 'Moon', body: Body.Moon },
        { name: 'Mercury', body: Body.Mercury },
        { name: 'Venus', body: Body.Venus },
        { name: 'Mars', body: Body.Mars },
        { name: 'Jupiter', body: Body.Jupiter },
        { name: 'Saturn', body: Body.Saturn },
        { name: 'Uranus', body: Body.Uranus },
        { name: 'Neptune', body: Body.Neptune },
        { name: 'Pluto', body: Body.Pluto },
    ];

    return planets.reduce((acc, p) => {
        const equator = Equator(p.body, time, observer, true, true);
        const ecliptic = Ecliptic(equator.vec); // Corrected to use vector
        const long = ecliptic.elon;

        const signs = [
            'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ];
        const signIndex = Math.floor(long / 30);
        const sign = signs[signIndex];
        const degree = long % 30; // Keep decimal for precision

        acc[p.name] = { sign, degree };
        return acc;
    }, {} as Record<string, { sign: string, degree: number }>);
};

// Calculate Compatibility Function
const getSignProperties = (sign: string) => {
    const props: Record<string, { element: string, modality: string, adjective: string }> = {
        'Aries': { element: 'Fire', modality: 'Cardinal', adjective: 'bold' },
        'Taurus': { element: 'Earth', modality: 'Fixed', adjective: 'steady' },
        'Gemini': { element: 'Air', modality: 'Mutable', adjective: 'curious' },
        'Cancer': { element: 'Water', modality: 'Cardinal', adjective: 'nurturing' },
        'Leo': { element: 'Fire', modality: 'Fixed', adjective: 'radiant' },
        'Virgo': { element: 'Earth', modality: 'Mutable', adjective: 'precise' },
        'Libra': { element: 'Air', modality: 'Cardinal', adjective: 'harmonious' },
        'Scorpio': { element: 'Water', modality: 'Fixed', adjective: 'intense' },
        'Sagittarius': { element: 'Fire', modality: 'Mutable', adjective: 'adventurous' },
        'Capricorn': { element: 'Earth', modality: 'Cardinal', adjective: 'ambitious' },
        'Aquarius': { element: 'Air', modality: 'Fixed', adjective: 'innovative' },
        'Pisces': { element: 'Water', modality: 'Mutable', adjective: 'dreamy' }
    };
    return props[sign] || { element: 'Unknown', modality: 'Unknown', adjective: 'mysterious' };
};

const calculateCompatibility = (sign1: string, sign2: string, type: 'love' | 'friendship' | 'work') => {
    const p1 = getSignProperties(sign1);
    const p2 = getSignProperties(sign2);

    let score = 50; // Base Score

    // 1. Element Interaction
    if (p1.element === p2.element) {
        score += 30; // Same Element: Excellent understanding
    } else if (
        (p1.element === 'Fire' && p2.element === 'Air') ||
        (p1.element === 'Air' && p2.element === 'Fire') ||
        (p1.element === 'Water' && p2.element === 'Earth') ||
        (p1.element === 'Earth' && p2.element === 'Water')
    ) {
        score += 25; // Complementary: High compatibility
    } else {
        // Friction / Challenge (Fire-Water, Air-Earth, etc.)
        score -= 10;
    }

    // 2. Modality Interaction
    if (p1.modality === p2.modality) {
        score += 15;
    }

    // 3. Type-Specific Adjustments
    if (type === 'love') {
        if (p1.element === 'Water' || p2.element === 'Water') score += 10;
        if (p1.modality === 'Fixed' && p2.modality === 'Fixed') score += 10;
        const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        const idx1 = signs.indexOf(sign1);
        const idx2 = signs.indexOf(sign2);
        if (Math.abs(idx1 - idx2) === 1 || Math.abs(idx1 - idx2) === 11) {
            score += 15; // Neighboring signs boost
        }
    } else if (type === 'friendship') {
        if (p1.element === 'Air' || p2.element === 'Air') score += 10;
        if (p1.modality === 'Mutable' && p2.modality === 'Mutable') score += 15;
    } else if (type === 'work') {
        if (p1.element === 'Earth' || p2.element === 'Earth') score += 15;
        if (p1.modality === 'Cardinal') score += 10;
    }

    score = Math.min(100, Math.max(0, score));

    let explanationTemplate = "";
    if (type === 'love') {
        explanationTemplate = `${sign2}'s ${p2.adjective} ${p2.element} nature ignites your ${p1.adjective} spirit, creating a dynamic connection.`;
        if (score > 80) explanationTemplate = `A matching soul! ${sign2}'s ${p2.element} energy deeply resonates with your ${p1.element} core for a passionate bond.`;
        else if (score < 50) explanationTemplate = `Opposites attract? ${sign2}'s ${p2.element} style challenges your ${p1.element} approach, offering growth through friction.`;
    } else if (type === 'friendship') {
        explanationTemplate = `${sign2}'s ${p2.modality} vibes complement your style, promising fun and shared adventures.`;
        if (p1.element === p2.element) explanationTemplate = `Besties! Sharing the ${p1.element} element means you instantly 'get' each other without words.`;
    } else { // Work
        explanationTemplate = `Collaboration is key. ${sign2}'s ${p2.adjective} approach can balance your workflow.`;
        if (p1.element === 'Earth' || p2.element === 'Earth') explanationTemplate = `A power team! The Earth energy here ensures practical results and solid progress.`;
    }

    return { score, description: explanationTemplate };
};

// Planet Traits Helper
const getPlanetTrait = (planet: string, sign: string) => {
    const traits: Record<string, Record<string, string>> = {
        "Virgo": {
            "Sun": "precision & service",
            "Mars": "meticulous drive",
            "Jupiter": "analytical growth",
            "Mercury": "critical thinking",
            "Venus": "humble devotion",
            "Saturn": "structured perfection",
            "Moon": "emotional analyze"
        }
    };
    if (traits[sign] && traits[sign][planet]) return traits[sign][planet];
    return `energy of ${sign}`;
};

// Birth Stones
const getBirthStone = (sign: string) => {
    const stones = {
        'Aries': 'Diamond 💎', 'Taurus': 'Emerald 💚', 'Gemini': 'Pearl 🐚',
        'Cancer': 'Ruby 🔴', 'Leo': 'Peridot 💛', 'Virgo': 'Sapphire 🔵',
        'Libra': 'Opal 🌈', 'Scorpio': 'Topaz 🟠', 'Sagittarius': 'Turquoise 🦋',
        'Capricorn': 'Garnet ❤️', 'Aquarius': 'Amethyst 💜', 'Pisces': 'Aquamarine 🌊'
    };
    return stones[sign as keyof typeof stones] || 'Unknown';
};

interface UltimateCosmicCompassProps {
    userName?: string;
    birthDate?: Date | string;
    onAskOracle?: (question: string) => void;
}

export default function UltimateCosmicCompass({
    userName = "Cosmic Traveler",
    birthDate = "1995-08-15",
    onAskOracle
}: UltimateCosmicCompassProps) {
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(0.8);
    const [isAutoRotating, setIsAutoRotating] = useState(true);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'planets' | 'signs' | 'houses' | 'compatibility'>('planets');
    const [selectedPartnerSign, setSelectedPartnerSign] = useState<string>('Leo');
    const [compatibilityType, setCompatibilityType] = useState<'love' | 'friendship' | 'work'>('love');
    const [selectedPlanet, setSelectedPlanet] = useState<{ name: string, description: string, color: string, symbol: string, natalDescription?: string, natalData?: { sign: string, degree: number } } | null>(null);
    const compassRef = useRef<HTMLDivElement>(null);

    // User Data
    const userBirthDateVal = typeof birthDate === 'string' ? birthDate : birthDate.toISOString().split('T')[0];

    // Deterministic Date Construction for Hydration Safety
    const [uYear, uMonth, uDay] = userBirthDateVal.split('-').map(Number);
    // Create UTC Date at Noon to avoid edge cases
    const utcDate = new Date(Date.UTC(uYear, uMonth - 1, uDay, 12, 0, 0));

    const userZodiac = getZodiacSign(userBirthDateVal);

    // Calculate Natal Positions
    const natalPositions = calculateNatalPositions(utcDate);

    // Format full birth date
    const formattedBirthDate = new Date(userBirthDateVal).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // All Zodiac Signs for Selection
    const allZodiacSigns = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    // Calculate Compatibility
    const compatibilityResult = calculateCompatibility(
        userZodiac.sign,
        selectedPartnerSign,
        compatibilityType
    );

    // Auto Rotation
    useEffect(() => {
        if (!isAutoRotating) return;
        const interval = setInterval(() => {
            setRotation(prev => (prev + 0.1) % 360);
        }, 30);
        return () => clearInterval(interval);
    }, [isAutoRotating]);

    // Coordinates Helper
    const getCoordinates = (radius: number, angle: number) => {
        const radian = (angle * Math.PI) / 180;
        return {
            x: radius * Math.cos(radian),
            y: radius * Math.sin(radian)
        };
    };

    // Derived Planets Data with Natal Info
    const planets = useMemo(() => {
        const basePlanets = [
            { name: 'Sun', symbol: '☉', type: 'Luminary', description: 'Self, ego, main purpose.', color: '#FFD700', bg: 'bg-yellow-400/20' },
            { name: 'Moon', symbol: '☽', type: 'Luminary', description: 'Emotions, subconscious, instincts.', color: '#E6E6FA', bg: 'bg-gray-300/20' },
            { name: 'Mercury', symbol: '☿', type: 'Personal', description: 'Communication, intellect, logic.', color: '#D3D3D3', bg: 'bg-blue-300/20' },
            { name: 'Venus', symbol: '♀', type: 'Personal', description: 'Love, beauty, values.', color: '#FFB6C1', bg: 'bg-pink-400/20' },
            { name: 'Mars', symbol: '♂', type: 'Personal', description: 'Action, drive, desire.', color: '#FF6347', bg: 'bg-red-500/20' },
            { name: 'Jupiter', symbol: '♃', type: 'Social', description: 'Growth, expansion, abundance.', color: '#FFA500', bg: 'bg-purple-400/20' },
            { name: 'Saturn', symbol: '♄', type: 'Social', description: 'Structure, discipline, karma.', color: '#F0E68C', bg: 'bg-indigo-400/20' },
            { name: 'Uranus', symbol: '♅', type: 'Generational', description: 'Innovation, rebellion, change.', color: '#AFEEEE', bg: 'bg-cyan-400/20' },
            { name: 'Neptune', symbol: '♆', type: 'Generational', description: 'Dreams, illusion, spirituality.', color: '#9370DB', bg: 'bg-teal-400/20' },
            { name: 'Pluto', symbol: '♇', type: 'Generational', description: 'Transformation, power, rebirth.', color: '#8B0000', bg: 'bg-slate-500/20' }
        ];

        return basePlanets.map(p => {
            const natal = natalPositions[p.name];
            const natalDesc = natal
                ? `Your ${p.name} in ${natal.sign} at ${natal.degree.toFixed(1)}° emphasizes ${getPlanetTrait(p.name, natal.sign)}.`
                : "Calculating...";

            return { ...p, natalDescription: natalDesc, natalData: natal };
        });
    }, [natalPositions]);


    const zodiacSigns = [
        { symbol: '♈', name: 'Aries', element: 'Fire', color: '#FF6B6B' },
        { symbol: '♉', name: 'Taurus', element: 'Earth', color: '#FFD166' },
        { symbol: '♊', name: 'Gemini', element: 'Air', color: '#06D6A0' },
        { symbol: '♋', name: 'Cancer', element: 'Water', color: '#118AB2' },
        { symbol: '♌', name: 'Leo', element: 'Fire', color: '#FF6B6B' },
        { symbol: '♍', name: 'Virgo', element: 'Earth', color: '#FFD166' },
        { symbol: '♎', name: 'Libra', element: 'Air', color: '#06D6A0' },
        { symbol: '♏', name: 'Scorpio', element: 'Water', color: '#118AB2' },
        { symbol: '♐', name: 'Sagittarius', element: 'Fire', color: '#FF6B6B' },
        { symbol: '♑', name: 'Capricorn', element: 'Earth', color: '#FFD166' },
        { symbol: '♒', name: 'Aquarius', element: 'Air', color: '#06D6A0' },
        { symbol: '♓', name: 'Pisces', element: 'Water', color: '#118AB2' },
    ];

    return (
        <div className="min-h-screen bg-transparent text-white overflow-x-hidden">



            <div className="relative z-10 container mx-auto px-4 py-8">

                {/* Header */}
                <div className="mb-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-2"
                    >
                        🌌 COSMIC COMPASS
                    </motion.h1>
                    <p className="text-gray-300 text-lg">Explore zodiac compatibility in a unique cosmic journey</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                    {/* User & Compatibility Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        {/* User Card */}
                        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl hover:bg-black/50 transition-colors">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 flex items-center justify-center text-2xl border-2 border-white/20 shadow-lg text-white">
                                    {userZodiac.symbol}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-md">{userName}</h3>
                                    <p className="text-gray-200 text-sm font-medium">✨ {userZodiac.sign} ({formattedBirthDate})</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-black/30 rounded-xl p-3 border border-white/5 hover:border-white/20 transition-colors">
                                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Element</div>
                                    <div className="font-bold text-lg flex items-center gap-2 text-white">
                                        {userZodiac.element === 'Fire' && '🔥 Fire'}
                                        {userZodiac.element === 'Earth' && '🌍 Earth'}
                                        {userZodiac.element === 'Air' && '💨 Air'}
                                        {userZodiac.element === 'Water' && '💧 Water'}
                                    </div>
                                </div>

                                <div className="bg-black/30 rounded-xl p-3 border border-white/5 hover:border-white/20 transition-colors">
                                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">Birth Stone</div>
                                    <div className="font-bold text-lg text-white">{getBirthStone(userZodiac.sign)}</div>
                                </div>

                                <div className="bg-black/30 rounded-xl p-3 border border-white/5 hover:border-white/20 transition-colors">
                                    <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Personality Traits</div>
                                    <div className="flex flex-wrap gap-2">
                                        {userZodiac.personality.map((trait, index) => (
                                            <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white border border-white/10">
                                                {trait}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Compatibility Selector */}
                        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl hover:bg-black/50 transition-colors">
                            <h3 className="text-xl font-bold mb-4 flex items-center text-white drop-shadow-md">
                                <span className="mr-2">💞</span> Compatibility Settings
                            </h3>

                            <div className="space-y-4">
                                {/* Type Selection */}
                                <div>
                                    <div className="text-sm text-gray-400 mb-2">Compatibility Type</div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCompatibilityType('love')}
                                            className={`flex-1 py-2 rounded-lg transition-all ${compatibilityType === 'love' ? 'bg-pink-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                                        >
                                            💖 Love
                                        </button>
                                        <button
                                            onClick={() => setCompatibilityType('friendship')}
                                            className={`flex-1 py-2 rounded-lg transition-all ${compatibilityType === 'friendship' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                                        >
                                            🤝 Friendship
                                        </button>
                                        <button
                                            onClick={() => setCompatibilityType('work')}
                                            className={`flex-1 py-2 rounded-lg transition-all ${compatibilityType === 'work' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                                        >
                                            💼 Work
                                        </button>
                                    </div>
                                </div>

                                {/* Partner Selection */}
                                <div>
                                    <div className="text-sm text-gray-400 mb-2">Partner's Zodiac Sign</div>
                                    <select
                                        value={selectedPartnerSign}
                                        onChange={(e) => setSelectedPartnerSign(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 outline-none focus:border-purple-500 text-white"
                                    >
                                        {allZodiacSigns.map(sign => {
                                            // Using a dummy year to get correct symbols from helper
                                            const signData = getZodiacSign(sign === 'Leo' ? '1995-08-01' : '1995-04-01');
                                            const symbol = zodiacSigns.find(z => z.name === sign)?.symbol || '';
                                            return (
                                                <option key={sign} value={sign} className="bg-gray-900">
                                                    {symbol} {sign}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>


                    </motion.div>

                    {/* Central Compass Area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2 flex flex-col gap-6"
                    >
                        {/* Visual Compass */}
                        <div className="relative w-full aspect-square max-h-[500px] bg-black/20 rounded-full mx-auto" ref={compassRef}>
                            <div
                                className="w-full h-full relative"
                                style={{
                                    transform: `rotate(${rotation}deg) scale(${zoom})`,
                                    transition: isAutoRotating ? 'none' : 'transform 0.3s ease'
                                }}
                            >
                                {/* Outer Glow */}
                                <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 p-2"></div>

                                {/* Zodiac Ring */}
                                <div className="absolute inset-4 rounded-full">
                                    {zodiacSigns.map((sign, index) => {
                                        const angle = index * 30;
                                        const coords = getCoordinates(220, angle);
                                        const isSelected = selectedElement === sign.name;
                                        return (
                                            <div
                                                key={index}
                                                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-125 hover:z-50"
                                                style={{
                                                    left: `calc(50% + ${coords.x}px)`,
                                                    top: `calc(50% + ${coords.y}px)`
                                                }}
                                                onClick={() => setSelectedElement(sign.name)}
                                            >
                                                <div className={`text-3xl ${isSelected ? 'scale-150 text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : 'text-purple-300/70'}`}>
                                                    {sign.symbol}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Center Star */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="text-6xl animate-pulse">🌟</div>
                                </div>

                                {/* Axis Lines */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5"></div>
                                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5"></div>
                                </div>
                            </div>
                        </div>


                        {/* Compatibility Result Card */}
                        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">

                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold">💫 Compatibility Result</h3>
                                    <div className="text-3xl">
                                        {compatibilityType === 'love' && '💖'}
                                        {compatibilityType === 'friendship' && '🤝'}
                                        {compatibilityType === 'work' && '💼'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* User */}
                                    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-500/30">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="text-3xl">{userZodiac.symbol}</div>
                                            <div>
                                                <div className="font-bold">Your Sign</div>
                                                <div className="text-xl">{userZodiac.sign}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            {userZodiac.element} • {userZodiac.dates}
                                        </div>
                                    </div>

                                    {/* Partner */}
                                    <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-4 border border-cyan-500/30">
                                        <div className="flex items-center gap-3 mb-3">
                                            {/* Note: In a real app, calculate symbol from selectedPartnerSign properly */}
                                            <div className="text-3xl">{zodiacSigns.find(z => z.name === selectedPartnerSign)?.symbol || '❓'}</div>
                                            <div>
                                                <div className="font-bold">Partner's Sign</div>
                                                <div className="text-xl">{selectedPartnerSign}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            {/* Find element for selected partner */}
                                            {zodiacSigns.find(z => z.name === selectedPartnerSign)?.element || 'Unknown'}
                                        </div>
                                    </div>
                                </div>

                                {/* Score & Progress */}
                                {/* Score & Progress */}
                                <motion.div
                                    key={selectedPartnerSign + compatibilityType}
                                    initial={{ scale: 0.95, opacity: 0.8 }}
                                    animate={{ scale: 1, opacity: 1, boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/30"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <div className="text-2xl font-bold mb-1">
                                                {compatibilityResult.description}
                                            </div>
                                            <div className="text-gray-300 capitalize text-sm">
                                                Detailed Analysis
                                            </div>
                                        </div>
                                    </div>

                                    {/* Multi-Type Progress Bars */}
                                    <div className="space-y-4 mb-6">
                                        {[
                                            { type: 'love', label: '💖 Love', color: 'from-pink-500 to-red-500' },
                                            { type: 'friendship', label: '🤝 Friendship', color: 'from-blue-400 to-teal-400' },
                                            { type: 'work', label: '💼 Work', color: 'from-green-400 to-emerald-500' }
                                        ].map((t) => {
                                            const res = calculateCompatibility(userZodiac.sign, selectedPartnerSign, t.type as any);
                                            return (
                                                <div key={t.type}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className={compatibilityType === t.type ? 'font-bold text-white' : 'text-gray-400'}>{t.label}</span>
                                                        <span className="font-mono">{res.score}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${res.score}%` }}
                                                            transition={{ duration: 1, ease: 'easeOut' }}
                                                            className={`h-full rounded-full bg-gradient-to-r ${t.color}`}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Ask Oracle Button */}
                                    <div className="flex justify-center mt-4">
                                        <button
                                            onClick={() => onAskOracle?.(`How can I improve my ${compatibilityType} compatibility with ${selectedPartnerSign} as a ${userZodiac.sign}?`)}
                                            className="bg-magic-gold text-midnight-purple px-6 py-3 rounded-full hover:scale-105 transition-transform font-bold shadow-[0_0_15px_rgba(255,215,0,0.4)] flex items-center gap-2"
                                        >
                                            <span>🔮</span> Ask Oracle about this compatibility
                                        </button>
                                    </div>

                                    {/* Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                        <div>
                                            <div className="text-sm text-gray-400 mb-2">✨ Strengths</div>
                                            <ul className="space-y-1 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    Strong emotional connection
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    Mutual understanding
                                                </li>
                                            </ul>
                                        </div>

                                        <div>
                                            <div className="text-sm text-gray-400 mb-2">⚡ Challenges</div>
                                            <ul className="space-y-1 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                    Different communication styles
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                    Occasional conflicts
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Tip */}
                                <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 rounded-xl p-4 border border-emerald-500/30 mt-6">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">💡</div>
                                        <div>
                                            <div className="font-bold mb-1">Compatibility Tip</div>
                                            <p className="text-gray-300 text-sm">
                                                {compatibilityResult.score >= 80
                                                    ? 'This is a great match! Focus on maintaining open communication and shared adventures.'
                                                    : compatibilityResult.score >= 60
                                                        ? 'Good potential for growth. Work on understanding each other\'s differences as strengths.'
                                                        : 'This relationship may require extra effort. Focus on compromise and finding common ground.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>


                {/* Tab Buttons */}
                <div className="mb-6 z-20 relative">
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => setActiveTab('planets')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'planets' ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg scale-105' : 'bg-gray-800 hover:bg-gray-700'}`}
                        >
                            🪐 Planets
                        </button>
                        <button
                            onClick={() => setActiveTab('signs')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'signs' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg scale-105' : 'bg-gray-800 hover:bg-gray-700'}`}
                        >
                            ♈ Zodiac Signs
                        </button>
                        <button
                            onClick={() => setActiveTab('compatibility')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'compatibility' ? 'bg-gradient-to-r from-emerald-600 to-green-600 shadow-lg scale-105' : 'bg-gray-800 hover:bg-gray-700'}`}
                        >
                            💞 Best Matches
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'compatibility' && (
                        <motion.div
                            key="compatibility"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
                        >
                            <h3 className="text-2xl font-bold mb-6">✨ Best Matches for {userZodiac.sign}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {userZodiac.compatibleWith.map((compatibleSign, index) => {
                                    const compatibility = calculateCompatibility(userZodiac.sign, compatibleSign, 'love');
                                    const symbol = zodiacSigns.find(z => z.name === compatibleSign)?.symbol || '✨';
                                    const element = zodiacSigns.find(z => z.name === compatibleSign)?.element || 'Unknown';

                                    return (
                                        <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border border-gray-700/50 hover:bg-gray-800 transition-colors group">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl group-hover:scale-125 transition-transform">{symbol}</div>
                                                    <div>
                                                        <div className="font-bold">{compatibleSign}</div>
                                                        <div className="text-sm text-gray-400">{element}</div>
                                                    </div>
                                                </div>
                                                <div className="text-xl font-bold text-green-400">
                                                    {compatibility.score}%
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-300">
                                                Excellent match for {compatibilityType} and long-term relationships
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'planets' && (
                        <motion.div
                            key="planets"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-2 md:grid-cols-5 gap-4"
                        >
                            {planets.map(planet => (
                                <div
                                    key={planet.name}
                                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-current transition-all cursor-pointer hover:scale-105"
                                    style={{ borderColor: selectedElement === planet.name ? planet.color : '' }}
                                    onClick={() => {
                                        setSelectedElement(planet.name);
                                        setSelectedPlanet(planet);
                                    }}
                                >
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-inner"
                                            style={{ backgroundColor: `${planet.color}20`, color: planet.color }}
                                        >
                                            {planet.symbol}
                                        </div>
                                        <div>
                                            <div className="font-bold">{planet.name}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 line-clamp-2">{planet.description}</div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'signs' && (
                        <motion.div
                            key="signs"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                        >
                            {zodiacSigns.map(sign => (
                                <div
                                    key={sign.name}
                                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 text-center hover:scale-105 transition-transform cursor-pointer border border-transparent hover:border-white/20"
                                    style={{ borderBottom: `2px solid ${sign.color}80` }}
                                    onClick={() => setSelectedElement(sign.name)}
                                >
                                    <div className="text-3xl mb-2 filter drop-shadow-md">{sign.symbol}</div>
                                    <div className="font-bold">{sign.name}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{sign.element}</div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Planet Detail Modal */}
            <AnimatePresence>
                {selectedPlanet && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPlanet(null)} // Backdrop click
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, y: 20, boxShadow: "0 0 0px rgba(0,0,0,0)" }}
                            animate={{ scale: 1, y: 0, boxShadow: `0 0 30px ${selectedPlanet.color}40` }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gray-900 border border-purple-500/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Ambient Glow Background */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                            <button
                                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors z-10"
                                onClick={() => setSelectedPlanet(null)}
                            >✕</button>

                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                    <span className="text-4xl filter drop-shadow-md" style={{ color: selectedPlanet.color }}>{selectedPlanet.symbol}</span>
                                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{selectedPlanet.name}</span>
                                </h3>

                                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent w-full my-4"></div>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-1">Archetype</h4>
                                        <p className="text-gray-200 leading-relaxed font-light">{selectedPlanet.description}</p>
                                    </div>

                                    {/* Personal Natal Info */}
                                    {selectedPlanet.natalDescription && (
                                        <div className="bg-white/5 p-4 rounded-lg mb-6 border border-white/10">
                                            <div className="text-sm text-purple-300 mb-1 font-mono uppercase tracking-widest">Natal Placement</div>
                                            <p className="text-white/90 italic">
                                                "{selectedPlanet.natalDescription}"
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        console.log(`Planet modal opened: ${selectedPlanet.name} with personal desc`);
                                        const question = selectedPlanet.natalData
                                            ? `How does my ${selectedPlanet.name} in ${selectedPlanet.natalData.sign} at ${selectedPlanet.natalData.degree.toFixed(1)}° influence my life as a ${userZodiac.sign}?`
                                            : `How does ${selectedPlanet.name} influence my life?`;

                                        onAskOracle?.(question);
                                        setSelectedPlanet(null);
                                    }}
                                    className="w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-600 text-white font-bold py-3.5 rounded-xl hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span className="text-lg group-hover:rotate-12 transition-transform duration-300">🔮</span>
                                    <span>Ask Oracle about my {selectedPlanet.name}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
