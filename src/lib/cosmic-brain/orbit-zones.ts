/**
 * Orbit Zones System
 * Replaces astrological "houses" with cosmic influence layers
 */

export interface OrbitZone {
    number: number; // 1-12
    name: string; // "Inner Core", "Signal Layer", etc.
    description: string; // What this zone represents
    dataType: string; // Type of cosmic data
    signalDepth: number; // 1-10 intensity/importance
    color: string; // Visualization color
}

export const ORBIT_ZONES: OrbitZone[] = [
    {
        number: 1,
        name: "Inner Core",
        description: "Personal identity matrix - core self data signature",
        dataType: "Identity Protocols",
        signalDepth: 10,
        color: "#FFD700"
    },
    {
        number: 2,
        name: "Resource Layer",
        description: "Material and energy resource allocation streams",
        dataType: "Asset Management",
        signalDepth: 8,
        color: "#4ECDC4"
    },
    {
        number: 3,
        name: "Communication Grid",
        description: "Data exchange and information network pathways",
        dataType: "Signal Transmission",
        signalDepth: 7,
        color: "#FFE66D"
    },
    {
        number: 4,
        name: "Foundation Matrix",
        description: "Origin point and ancestral data repository",
        dataType: "Root Archives",
        signalDepth: 9,
        color: "#A8DADC"
    },
    {
        number: 5,
        name: "Expression Field",
        description: "Creative output and manifestation protocols",
        dataType: "Creation Streams",
        signalDepth: 6,
        color: "#F4A261"
    },
    {
        number: 6,
        name: "Optimization Zone",
        description: "System maintenance and efficiency calibration",
        dataType: "Performance Metrics",
        signalDepth: 7,
        color: "#2A9D8F"
    },
    {
        number: 7,
        name: "Connection Nexus",
        description: "External interface and partnership protocols",
        dataType: "Relational Data",
        signalDepth: 8,
        color: "#E76F51"
    },
    {
        number: 8,
        name: "Transformation Vault",
        description: "Deep change and regeneration processes",
        dataType: "Metamorphosis Codes",
        signalDepth: 10,
        color: "#8B5CF6"
    },
    {
        number: 9,
        name: "Expansion Vector",
        description: "Long-range exploration and knowledge acquisition",
        dataType: "Discovery Paths",
        signalDepth: 6,
        color: "#EC4899"
    },
    {
        number: 10,
        name: "Achievement Pinnacle",
        description: "Public interface and mastery demonstration zone",
        dataType: "Legacy Protocols",
        signalDepth: 9,
        color: "#10B981"
    },
    {
        number: 11,
        name: "Innovation Sphere",
        description: "Future vision and collective network access",
        dataType: "Advancement Streams",
        signalDepth: 5,
        color: "#3B82F6"
    },
    {
        number: 12,
        name: "Infinite Boundary",
        description: "Subconscious realm and universal connection layer",
        dataType: "Transcendent Data",
        signalDepth: 10,
        color: "#06B6D4"
    }
];

/**
 * Get Orbit Zone by number
 */
export function getOrbitZone(number: number): OrbitZone | undefined {
    return ORBIT_ZONES.find(zone => zone.number === number);
}

/**
 * Get all Orbit Zones
 */
export function getAllOrbitZones(): OrbitZone[] {
    return ORBIT_ZONES;
}

/**
 * Get Orbit Zone color
 */
export function getOrbitZoneColor(number: number): string {
    const zone = getOrbitZone(number);
    return zone?.color || "#FFFFFF";
}

/**
 * Get high-priority Orbit Zones (signal depth >= 8)
 */
export function getHighPriorityZones(): OrbitZone[] {
    return ORBIT_ZONES.filter(zone => zone.signalDepth >= 8);
}
