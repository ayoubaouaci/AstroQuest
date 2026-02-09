export interface BirthData {
    name: string;
    birthDate: Date;
    birthTime: string; // "HH:MM"
    birthPlace: string;
    latitude: number;
    longitude: number;
}

export interface PlanetPosition {
    planet: string;
    symbol: string;
    sign: string;
    signSymbol: string;
    degree: number;
    minute: number;
    house: number;
    retrograde: boolean;
}

export interface HouseCusp {
    house: number;
    sign: string;
    symbol: string;
    degree: number;
    minute: number;
}

export interface AstroChart {
    planets: PlanetPosition[];
    houses: HouseCusp[];
    ascendant: { sign: string; degree: number; minute: number };
    midheaven: { sign: string; degree: number; minute: number };
    sunSign: string;
    moonSign: string;
    elementBalance: {
        fire: number;
        earth: number;
        air: number;
        water: number;
    };
}

const ZODIAC_SIGNS = [
    { name: 'Aries', symbol: '♈', element: 'fire' },
    { name: 'Taurus', symbol: '♉', element: 'earth' },
    { name: 'Gemini', symbol: '♊', element: 'air' },
    { name: 'Cancer', symbol: '♋', element: 'water' },
    { name: 'Leo', symbol: '♌', element: 'fire' },
    { name: 'Virgo', symbol: '♍', element: 'earth' },
    { name: 'Libra', symbol: '♎', element: 'air' },
    { name: 'Scorpio', symbol: '♏', element: 'water' },
    { name: 'Sagittarius', symbol: '♐', element: 'fire' },
    { name: 'Capricorn', symbol: '♑', element: 'earth' },
    { name: 'Aquarius', symbol: '♒', element: 'air' },
    { name: 'Pisces', symbol: '♓', element: 'water' },
];

const PLANETS_DATA = [
    { name: 'Sun', symbol: '☉', orbitDays: 365.25, color: '#FFD700' },
    { name: 'Moon', symbol: '☽', orbitDays: 27.3, color: '#C0C0C0' },
    { name: 'Mercury', symbol: '☿', orbitDays: 88, color: '#A9A9A9' },
    { name: 'Venus', symbol: '♀', orbitDays: 225, color: '#FFC0CB' },
    { name: 'Mars', symbol: '♂', orbitDays: 687, color: '#FF4500' },
    { name: 'Jupiter', symbol: '♃', orbitDays: 4333, color: '#FFA500' },
    { name: 'Saturn', symbol: '♄', orbitDays: 10759, color: '#F4A460' },
    { name: 'Uranus', symbol: '♅', orbitDays: 30687, color: '#40E0D0' },
    { name: 'Neptune', symbol: '♆', orbitDays: 60190, color: '#4169E1' },
    { name: 'Pluto', symbol: '♇', orbitDays: 90560, color: '#8B0000' },
];

export async function calculateNatalChart(birthData: BirthData): Promise<AstroChart> {
    const { birthDate, birthTime, latitude, longitude } = birthData;

    const [hours, minutes] = birthTime.split(':').map(Number);
    const utcDate = new Date(birthDate);
    utcDate.setHours(hours, minutes);

    const planets = calculatePlanetPositions(utcDate, latitude, longitude);
    const houses = calculateHouseCusps(utcDate, latitude, longitude);

    return {
        planets,
        houses,
        ascendant: houses[0],
        midheaven: houses[9],
        sunSign: planets.find(p => p.planet === 'Sun')?.sign || 'Unknown',
        moonSign: planets.find(p => p.planet === 'Moon')?.sign || 'Unknown',
        elementBalance: calculateElementBalance(planets)
    };
}

function calculatePlanetPositions(date: Date, lat: number, lon: number): PlanetPosition[] {
    const daysSinceEpoch = (date.getTime() - new Date(2000, 0, 1).getTime()) / (1000 * 60 * 60 * 24);

    return PLANETS_DATA.map((planet, index) => {
        const orbitProgress = (daysSinceEpoch % planet.orbitDays) / planet.orbitDays;
        const totalDegrees = orbitProgress * 360;
        const signIndex = Math.floor(totalDegrees / 30) % 12;
        const sign = ZODIAC_SIGNS[signIndex];
        const degreeInSign = totalDegrees % 30;

        // Adjust for latitude/longitude
        const adjustedDegree = (degreeInSign + (lat * 0.1) + (lon * 0.05)) % 30;

        return {
            planet: planet.name,
            symbol: planet.symbol,
            sign: sign.name,
            signSymbol: sign.symbol,
            degree: Math.floor(adjustedDegree),
            minute: Math.floor((adjustedDegree % 1) * 60),
            house: calculateHouseForPlanet(totalDegrees, lat, lon),
            retrograde: Math.random() > 0.8
        };
    });
}

function calculateHouseCusps(date: Date, lat: number, lon: number): HouseCusp[] {
    const houses: HouseCusp[] = [];
    const localSiderealTime = calculateLocalSiderealTime(date, lon);

    for (let i = 0; i < 12; i++) {
        const houseDegree = (localSiderealTime + (i * 30) + (lat * 0.5)) % 360;
        const signIndex = Math.floor(houseDegree / 30) % 12;
        const degreeInSign = houseDegree % 30;
        const sign = ZODIAC_SIGNS[signIndex];

        houses.push({
            house: i + 1,
            sign: sign.name,
            symbol: sign.symbol,
            degree: Math.floor(degreeInSign),
            minute: Math.floor((degreeInSign % 1) * 60)
        });
    }

    return houses;
}

function calculateLocalSiderealTime(date: Date, longitude: number): number {
    const jd = dateToJulianDay(date);
    const t = (jd - 2451545.0) / 36525.0;
    const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + t * t * (0.000387933 - t / 38710000.0);
    const lst = (gmst + longitude) % 360;
    return lst < 0 ? lst + 360 : lst;
}

function dateToJulianDay(date: Date): number {
    const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
    const y = date.getFullYear() + 4800 - a;
    const m = (date.getMonth() + 1) + 12 * a - 3;

    return date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function calculateHouseForPlanet(planetDegree: number, lat: number, lon: number): number {
    const adjustedDegree = (planetDegree + (lat * 0.5)) % 360;
    return Math.floor(adjustedDegree / 30) % 12 + 1;
}

function calculateElementBalance(planets: PlanetPosition[]): { fire: number; earth: number; air: number; water: number } {
    const balance = { fire: 0, earth: 0, air: 0, water: 0 };

    planets.forEach(planet => {
        const sign = ZODIAC_SIGNS.find(z => z.name === planet.sign);
        if (sign) {
            balance[sign.element as keyof typeof balance]++;
        }
    });

    return balance;
}

export function generateMockChart(): AstroChart {
    return {
        planets: [
            { planet: 'Sun', symbol: '☉', sign: 'Leo', signSymbol: '♌', degree: 15, minute: 30, house: 10, retrograde: false },
            { planet: 'Moon', symbol: '☽', sign: 'Cancer', signSymbol: '♋', degree: 23, minute: 45, house: 4, retrograde: false },
            { planet: 'Mercury', symbol: '☿', sign: 'Virgo', signSymbol: '♍', degree: 5, minute: 12, house: 11, retrograde: true },
            { planet: 'Venus', symbol: '♀', sign: 'Libra', signSymbol: '♎', degree: 18, minute: 52, house: 12, retrograde: false },
            { planet: 'Mars', symbol: '♂', sign: 'Aries', signSymbol: '♈', degree: 3, minute: 34, house: 5, retrograde: false },
            { planet: 'Jupiter', symbol: '♃', sign: 'Pisces', signSymbol: '♓', degree: 28, minute: 10, house: 9, retrograde: false },
            { planet: 'Saturn', symbol: '♄', sign: 'Aquarius', signSymbol: '♒', degree: 12, minute: 48, house: 8, retrograde: false },
            { planet: 'Uranus', symbol: '♅', sign: 'Taurus', signSymbol: '♉', degree: 6, minute: 23, house: 2, retrograde: false },
            { planet: 'Neptune', symbol: '♆', sign: 'Pisces', signSymbol: '♓', degree: 22, minute: 17, house: 9, retrograde: false },
            { planet: 'Pluto', symbol: '♇', sign: 'Capricorn', signSymbol: '♑', degree: 29, minute: 59, house: 7, retrograde: false },
        ],
        houses: ZODIAC_SIGNS.map((sign, i) => ({
            house: i + 1,
            sign: sign.name,
            symbol: sign.symbol,
            degree: Math.floor(Math.random() * 30),
            minute: Math.floor(Math.random() * 60)
        })),
        ascendant: { sign: 'Leo', degree: 15, minute: 30 },
        midheaven: { sign: 'Taurus', degree: 22, minute: 45 },
        sunSign: 'Leo',
        moonSign: 'Cancer',
        elementBalance: { fire: 3, earth: 2, air: 4, water: 3 }
    };
}
