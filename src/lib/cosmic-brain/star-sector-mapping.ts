/**
 * Star Sector Mapping System
 * Maps astronomical positions to Star Sectors (replacing zodiac terminology)
 */

export interface StarSector {
    id: string; // "A1", "B2", etc.
    name: string; // "Sector Alpha-1"
    symbol: string; // Unicode symbol (repurposed zodiac glyphs as "Ancient Star Codes")
    description: string; // Sci-fi flavor text
    degreeRange: [number, number]; // [0, 30], [30, 60], etc.
    color: string; // Hex color for visualization
    dataStream: string; // What kind of cosmic data this sector provides
}

export const STAR_SECTORS: StarSector[] = [
    {
        id: "A1",
        name: "Sector Alpha-1",
        symbol: "♈",
        description: "The Vanguard Sector - First point of cosmic entry",
        degreeRange: [0, 30],
        color: "#FF6B6B",
        dataStream: "Initiative Protocols"
    },
    {
        id: "B2",
        name: "Sector Beta-2",
        symbol: "♉",
        description: "The Foundation Sector - Stable cosmic anchor point",
        degreeRange: [30, 60],
        color: "#4ECDC4",
        dataStream: "Resource Matrices"
    },
    {
        id: "C3",
        name: "Sector Gamma-3",
        symbol: "♊",
        description: "The Nexus Sector - Dual signal pathways",
        degreeRange: [60, 90],
        color: "#FFE66D",
        dataStream: "Communication Networks"
    },
    {
        id: "D4",
        name: "Sector Delta-4",
        symbol: "♋",
        description: "The Sanctuary Sector - Protected cosmic zone",
        degreeRange: [90, 120],
        color: "#A8DADC",
        dataStream: "Memory Archives"
    },
    {
        id: "E5",
        name: "Sector Epsilon-5",
        symbol: "♌",
        description: "The Radiance Sector - High-energy cosmic core",
        degreeRange: [120, 150],
        color: "#F4A261",
        dataStream: "Power Signatures"
    },
    {
        id: "F6",
        name: "Sector Zeta-6",
        symbol: "♍",
        description: "The Precision Sector - Calibrated data streams",
        degreeRange: [150, 180],
        color: "#2A9D8F",
        dataStream: "Analysis Protocols"
    },
    {
        id: "G7",
        name: "Sector Eta-7",
        symbol: "♎",
        description: "The Equilibrium Sector - Balanced cosmic forces",
        degreeRange: [180, 210],
        color: "#E76F51",
        dataStream: "Harmony Frequencies"
    },
    {
        id: "H8",
        name: "Sector Theta-8",
        symbol: "♏",
        description: "The Depths Sector - Deep space signal origin",
        degreeRange: [210, 240],
        color: "#8B5CF6",
        dataStream: "Transformation Codes"
    },
    {
        id: "I9",
        name: "Sector Iota-9",
        symbol: "♐",
        description: "The Expansion Sector - Far-reaching cosmic vectors",
        degreeRange: [240, 270],
        color: "#EC4899",
        dataStream: "Exploration Paths"
    },
    {
        id: "J10",
        name: "Sector Kappa-10",
        symbol: "♑",
        description: "The Summit Sector - Peak cosmic achievement zone",
        degreeRange: [270, 300],
        color: "#10B981",
        dataStream: "Mastery Blueprints"
    },
    {
        id: "K11",
        name: "Sector Lambda-11",
        symbol: "♒",
        description: "The Innovation Sector - Advanced cosmic frequencies",
        degreeRange: [300, 330],
        color: "#3B82F6",
        dataStream: "Future Protocols"
    },
    {
        id: "L12",
        name: "Sector Mu-12",
        symbol: "♓",
        description: "The Infinite Sector - Boundless cosmic ocean",
        degreeRange: [330, 360],
        color: "#06B6D4",
        dataStream: "Universal Consciousness"
    }
];

/**
 * Get Star Sector from ecliptic longitude degree
 */
export function getSectorFromDegree(degree: number): StarSector {
    // Normalize degree to 0-360
    let normalizedDegree = degree % 360;
    if (normalizedDegree < 0) normalizedDegree += 360;

    const sectorIndex = Math.floor(normalizedDegree / 30);
    return STAR_SECTORS[sectorIndex];
}

/**
 * Get Star Sector by ID
 */
export function getSectorById(id: string): StarSector | undefined {
    return STAR_SECTORS.find(sector => sector.id === id);
}

/**
 * Get all Star Sectors in order
 */
export function getAllSectors(): StarSector[] {
    return STAR_SECTORS;
}

/**
 * Get sector color by degree
 */
export function getSectorColor(degree: number): string {
    return getSectorFromDegree(degree).color;
}

/**
 * Get sector symbol by degree
 */
export function getSectorSymbol(degree: number): string {
    return getSectorFromDegree(degree).symbol;
}
