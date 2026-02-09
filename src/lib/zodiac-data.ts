
export interface ZodiacSign {
    id: string;
    name: string;
    dates: string;
    element: "Fire" | "Earth" | "Air" | "Water";
    planet: string;
    skill: string;
    effect: string;
    image: string; // Placeholder or path to asset
    color: string;
    symbol: string;
    startMonth: number; // 1-12
    startDay: number;
    endMonth: number;
    endDay: number;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
    {
        id: "aries",
        name: "Aries",
        dates: "Mar 21 - Apr 19",
        element: "Fire",
        planet: "Mars",
        skill: "Warrior's Charge",
        effect: "Deal 25% more damage for first strike",
        image: "/Aries.png",
        color: "#FF6B6B",
        symbol: "♈",
        startMonth: 3,
        startDay: 21,
        endMonth: 4,
        endDay: 19
    },
    {
        id: "taurus",
        name: "Taurus",
        dates: "Apr 20 - May 20",
        element: "Earth",
        planet: "Venus",
        skill: "Earth's Resilience",
        effect: "Take 30% less damage when standing still",
        image: "/Taurus.png",
        color: "#4ECDC4",
        symbol: "♉",
        startMonth: 4,
        startDay: 20,
        endMonth: 5,
        endDay: 20
    },
    {
        id: "gemini",
        name: "Gemini",
        dates: "May 21 - Jun 20",
        element: "Air",
        planet: "Mercury",
        skill: "Twin Communication",
        effect: "Can bypass dialogue obstacles 30% faster. Gains double information from NPC conversations.",
        image: "/Gemini.png",
        color: "#FFE66D",
        symbol: "♊",
        startMonth: 5,
        startDay: 21,
        endMonth: 6,
        endDay: 20
    },
    {
        id: "cancer",
        name: "Cancer",
        dates: "Jun 21 - Jul 22",
        element: "Water",
        planet: "Moon",
        skill: "Lunar Shield",
        effect: "Briefly invincible after taking critical damage (Cooldown: 120s)",
        image: "/Cancer.png",
        color: "#F7FFF7",
        symbol: "♋",
        startMonth: 6,
        startDay: 21,
        endMonth: 7,
        endDay: 22
    },
    {
        id: "leo",
        name: "Leo",
        dates: "Jul 23 - Aug 22",
        element: "Fire",
        planet: "Sun",
        skill: "Lion's Roar",
        effect: "Intimidate weak enemies, causing them to flee",
        image: "/Leo.png",
        color: "#FF9F1C",
        symbol: "♌",
        startMonth: 7,
        startDay: 23,
        endMonth: 8,
        endDay: 22
    },
    {
        id: "virgo",
        name: "Virgo",
        dates: "Aug 23 - Sep 22",
        element: "Earth",
        planet: "Mercury",
        skill: "Analytical Sight",
        effect: "Highlight hidden traps and loot containers nearby",
        image: "/Virgo.png",
        color: "#9BC53D",
        symbol: "♍",
        startMonth: 8,
        startDay: 23,
        endMonth: 9,
        endDay: 22
    },
    {
        id: "libra",
        name: "Libra",
        dates: "Sep 23 - Oct 22",
        element: "Air",
        planet: "Venus",
        skill: "Scales of Balance",
        effect: "Trade prices are 20% better in all markets",
        image: "/Libra.png",
        color: "#E2CFEA",
        symbol: "♎",
        startMonth: 9,
        startDay: 23,
        endMonth: 10,
        endDay: 22
    },
    {
        id: "scorpio",
        name: "Scorpio",
        dates: "Oct 23 - Nov 21",
        element: "Water",
        planet: "Pluto",
        skill: "Venomous Strike",
        effect: "Attacks have a 15% chance to apply poison damage over time",
        image: "/Scorpio.png",
        color: "#5F0F40",
        symbol: "♏",
        startMonth: 10,
        startDay: 23,
        endMonth: 11,
        endDay: 21
    },
    {
        id: "sagittarius",
        name: "Sagittarius",
        dates: "Nov 22 - Dec 21",
        element: "Fire",
        planet: "Jupiter",
        skill: "Archer's Aim",
        effect: "Ranged attacks have increased accuracy and range",
        image: "/Sagittarius.png",
        color: "#FB8B24",
        symbol: "♐",
        startMonth: 11,
        startDay: 22,
        endMonth: 12,
        endDay: 21
    },
    {
        id: "capricorn",
        name: "Capricorn",
        dates: "Dec 22 - Jan 19",
        element: "Earth",
        planet: "Saturn",
        skill: "Mountain Climber",
        effect: "Stamina drains 50% slower when climbing or traversing difficult terrain",
        image: "/Capricorn.png",
        color: "#2F4858",
        symbol: "♑",
        startMonth: 12,
        startDay: 22,
        endMonth: 1,
        endDay: 19
    },
    {
        id: "aquarius",
        name: "Aquarius",
        dates: "Jan 20 - Feb 18",
        element: "Air",
        planet: "Uranus",
        skill: "Water Bearer",
        effect: "Potions restored 25% more health/mana",
        image: "/Aquarius.png",
        color: "#5BC0EB",
        symbol: "♒",
        startMonth: 1,
        startDay: 20,
        endMonth: 2,
        endDay: 18
    },
    {
        id: "pisces",
        name: "Pisces",
        dates: "Feb 19 - Mar 20",
        element: "Water",
        planet: "Neptune",
        skill: "Dreamer's Luck",
        effect: "Small chance to find rare items in common chests",
        image: "/Pisces.png",
        color: "#96E6B3",
        symbol: "♓",
        startMonth: 2,
        startDay: 19,
        endMonth: 3,
        endDay: 20
    }
];

export function getZodiacByDate(date: Date): ZodiacSign {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const sign = ZODIAC_SIGNS.find(z => {
        if (z.startMonth === month && day >= z.startDay) return true;
        if (z.endMonth === month && day <= z.endDay) return true;
        // Special case for Capricorn crossing year boundary
        if (z.startMonth === 12 && month === 12 && day >= z.startDay) return true;
        if (z.endMonth === 1 && month === 1 && day <= z.endDay) return true;
        return false;
    });

    return sign || ZODIAC_SIGNS[0]; // Default to Aries if something goes wrong
}
