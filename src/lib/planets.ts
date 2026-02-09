export type DangerLevel = 'safe' | 'risky' | 'critical';

export interface PlanetConfig {
    id: string;
    name: string;
    description: string;
    levelReq: number;
    danger: DangerLevel;
    colors: {
        primary: string;
        secondary: string;
        atmosphere: string;
        crater: string;
    };
    orbitSpeed: number; // Seconds for full rotation
    type: 'terrestrial' | 'gas_giant' | 'ruin' | 'void';
}

export const PLANETS: PlanetConfig[] = [
    {
        id: 'antigravity-prime',
        name: 'Antigravity Prime',
        description: 'The stable anchor of the known sector.',
        levelReq: 1,
        danger: 'safe',
        colors: {
            primary: '#1e3a8a', // Deep Blue
            secondary: '#3b82f6', // Light Blue
            atmosphere: '#60a5fa',
            crater: '#172554'
        },
        orbitSpeed: 60,
        type: 'terrestrial'
    },
    {
        id: 'sector-7g',
        name: 'Sector 7G Ruin',
        description: 'A shattered world echoing with old signals.',
        levelReq: 3,
        danger: 'risky',
        colors: {
            primary: '#7f1d1d', // Dark Red
            secondary: '#b91c1c', // Red
            atmosphere: '#fca5a5',
            crater: '#450a0a'
        },
        orbitSpeed: 90,
        type: 'ruin'
    },
    {
        id: 'void-nursery',
        name: 'Void Nursery',
        description: 'Where the nothingness is born.',
        levelReq: 5,
        danger: 'critical',
        colors: {
            primary: '#2e1065', // Dark Purple
            secondary: '#581c87', // Purple
            atmosphere: '#d8b4fe',
            crater: '#000000'
        },
        orbitSpeed: 120,
        type: 'void'
    }
];
