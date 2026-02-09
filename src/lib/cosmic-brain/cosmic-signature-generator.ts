/**
 * Cosmic Signature Generator
 * Generates unique cosmic signatures from calibration data
 */

import { calculateNatalChart, NatalChart } from "./calculations";
import { getSectorFromDegree, StarSector, STAR_SECTORS } from "./star-sector-mapping";
import { ORBIT_ZONES, OrbitZone } from "./orbit-zones";

export interface CosmicSignature {
    id: string; // Unique hash
    calibrationDate: string;
    calibrationTime: string;
    spatialCoords: {
        lat: number;
        lng: number;
        location: string;
    };

    // Primary Sectors (calculated from astronomical positions)
    primarySector: StarSector; // Sun position
    emotionalSector: StarSector; // Moon position
    interfaceSector: StarSector; // Ascendant

    // Full natal chart data (for internal calculations)
    natalChart: NatalChart;

    // Orbit Zone Activations
    orbitZones: {
        [key: number]: {
            activeSector: StarSector;
            signalStrength: number; // 0-100
        };
    };

    // Content Access Control
    activePlanets: string[]; // Which planets to show in book
    unlockedEvents: string[]; // Which cosmic events are accessible
    archiveAccess: string[]; // What the Archive Guide can read
}

/**
 * Generate a unique signature ID from calibration data
 */
function generateSignatureId(
    date: string,
    time: string,
    lat: number,
    lng: number
): string {
    const data = `${date}-${time}-${lat.toFixed(4)}-${lng.toFixed(4)}`;
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return `SIG-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
}

/**
 * Calculate signal strength based on planetary position
 * Returns a value from 0-100
 */
function calculateSignalStrength(degree: number, orbitZoneNumber: number): number {
    // Base strength from degree position within sector
    const degreeInSector = degree % 30;
    const baseStrength = 50 + (degreeInSector / 30) * 50;

    // Modify based on orbit zone importance
    const zone = ORBIT_ZONES.find(z => z.number === orbitZoneNumber);
    const zoneMultiplier = zone ? zone.signalDepth / 10 : 0.5;

    return Math.min(100, Math.round(baseStrength * zoneMultiplier));
}

/**
 * Determine which planets are active based on signature
 * For now, we'll activate planets based on which sectors they fall into
 */
function determineActivePlanets(chart: NatalChart): string[] {
    const planets = ["Sun", "Moon", "Mercury", "Venus", "Mars"];

    // Calculate full degree positions (sign index * 30 + degree in sign)
    const sunDegree = (getSignIndex(chart.sunSign) * 30) + chart.sunDegree;
    const moonDegree = (getSignIndex(chart.moonSign) * 30) + chart.moonDegree;

    // Activate different planets based on primary sectors
    const sunSector = getSectorFromDegree(sunDegree);
    const moonSector = getSectorFromDegree(moonDegree);

    // Add outer planets based on sector patterns
    if (["A1", "E5", "I9"].includes(sunSector.id)) {
        planets.push("Jupiter");
    }
    if (["D4", "H8", "L12"].includes(moonSector.id)) {
        planets.push("Neptune");
    }
    if (["J10", "F6", "B2"].includes(sunSector.id)) {
        planets.push("Saturn");
    }

    return planets;
}

/**
 * Helper to get sign index from name
 */
function getSignIndex(signName: string): number {
    const signs = [
        "Aries", "Taurus", "Gemini", "Cancer",
        "Leo", "Virgo", "Libra", "Scorpio",
        "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];
    return signs.indexOf(signName);
}

/**
 * Determine unlocked cosmic events based on signature
 */
function determineUnlockedEvents(primarySector: StarSector, emotionalSector: StarSector): string[] {
    const events: string[] = [];

    // Base events always available
    events.push("daily-cosmic-alignment", "quest-generation");

    // Unlock special events based on sector combinations
    if (primarySector.id === emotionalSector.id) {
        events.push("harmonic-convergence");
    }

    // Fire sectors (A1, E5, I9) unlock energy events
    if (["A1", "E5", "I9"].includes(primarySector.id)) {
        events.push("solar-flare-boost");
    }

    // Water sectors (D4, H8, L12) unlock intuition events
    if (["D4", "H8", "L12"].includes(emotionalSector.id)) {
        events.push("lunar-tide-reading");
    }

    return events;
}

/**
 * Determine archive access levels
 */
function determineArchiveAccess(
    primarySector: StarSector,
    interfaceSector: StarSector
): string[] {
    const access: string[] = ["basic-readings", "daily-forecast"];

    // Earth sectors (B2, F6, J10) unlock detailed analysis
    if (["B2", "F6", "J10"].includes(primarySector.id)) {
        access.push("detailed-analysis");
    }

    // Air sectors (C3, G7, K11) unlock communication archives
    if (["C3", "G7", "K11"].includes(interfaceSector.id)) {
        access.push("communication-archives");
    }

    return access;
}

/**
 * Main function: Generate Cosmic Signature from calibration data
 */
export function generateCosmicSignature(
    date: string,
    time: string,
    latitude: number,
    longitude: number,
    location: string
): CosmicSignature {
    // Calculate natal chart using existing astronomy engine
    const natalChart = calculateNatalChart(date, time, latitude, longitude);

    // Convert to full degree positions
    const sunFullDegree = (getSignIndex(natalChart.sunSign) * 30) + natalChart.sunDegree;
    const moonFullDegree = (getSignIndex(natalChart.moonSign) * 30) + natalChart.moonDegree;
    const risingFullDegree = (getSignIndex(natalChart.risingSign) * 30) + natalChart.risingDegree;

    // Map to Star Sectors
    const primarySector = getSectorFromDegree(sunFullDegree);
    const emotionalSector = getSectorFromDegree(moonFullDegree);
    const interfaceSector = getSectorFromDegree(risingFullDegree);

    // Calculate Orbit Zone activations
    // For simplicity, we'll distribute planets across zones based on a pattern
    const orbitZones: CosmicSignature["orbitZones"] = {};

    // Assign primary sectors to key zones
    orbitZones[1] = {
        activeSector: interfaceSector,
        signalStrength: calculateSignalStrength(risingFullDegree, 1)
    };
    orbitZones[5] = {
        activeSector: primarySector,
        signalStrength: calculateSignalStrength(sunFullDegree, 5)
    };
    orbitZones[4] = {
        activeSector: emotionalSector,
        signalStrength: calculateSignalStrength(moonFullDegree, 4)
    };

    // Fill remaining zones with calculated sectors
    for (let i = 1; i <= 12; i++) {
        if (!orbitZones[i]) {
            const zoneDegree = (risingFullDegree + ((i - 1) * 30)) % 360;
            orbitZones[i] = {
                activeSector: getSectorFromDegree(zoneDegree),
                signalStrength: calculateSignalStrength(zoneDegree, i)
            };
        }
    }

    // Determine content access
    const activePlanets = determineActivePlanets(natalChart);
    const unlockedEvents = determineUnlockedEvents(primarySector, emotionalSector);
    const archiveAccess = determineArchiveAccess(primarySector, interfaceSector);

    // Generate unique ID
    const id = generateSignatureId(date, time, latitude, longitude);

    return {
        id,
        calibrationDate: date,
        calibrationTime: time,
        spatialCoords: {
            lat: latitude,
            lng: longitude,
            location
        },
        primarySector,
        emotionalSector,
        interfaceSector,
        natalChart,
        orbitZones,
        activePlanets,
        unlockedEvents,
        archiveAccess
    };
}

/**
 * Get a summary description of the cosmic signature
 */
export function getSignatureSummary(signature: CosmicSignature): string {
    return `Cosmic Signature ${signature.id} initialized. ` +
        `Primary Sector: ${signature.primarySector.name} (${signature.primarySector.symbol}). ` +
        `Emotional Sector: ${signature.emotionalSector.name} (${signature.emotionalSector.symbol}). ` +
        `Interface Sector: ${signature.interfaceSector.name} (${signature.interfaceSector.symbol}). ` +
        `Access granted to ${signature.activePlanets.length} planetary data streams.`;
}
