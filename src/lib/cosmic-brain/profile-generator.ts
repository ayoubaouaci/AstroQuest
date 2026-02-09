import { NatalChart } from "./calculations";
import { CosmicSignature } from "./cosmic-signature-generator";
import { Quest } from "./quest-generator";

export interface UserProfile {
    name: string;
    birthDate?: string;
    birthTime?: string;
    birthLocation: string;
    latitude: number;
    longitude: number;
    chart?: NatalChart;
    cosmicSignature?: CosmicSignature;
    level?: number;
    archetype?: string;
    element?: string;
    questLog?: Quest[];
    isAdmin?: boolean;
}

export function generateUserProfile(name: string): UserProfile {
    // Mock generation logic
    const archetypes = ["Void Walker", "Star Weaver", "Nebula Sage", "Quantum Drifter"];
    const elements = ["Aether", "Plasma", "Gravity", "Dark Matter"];

    return {
        name,
        birthDate: "2024-01-01",
        birthTime: "12:00",
        birthLocation: "Cosmic Origin",
        latitude: 0,
        longitude: 0,
        level: 1,
        archetype: archetypes[Math.floor(Math.random() * archetypes.length)],
        element: elements[Math.floor(Math.random() * elements.length)],
        questLog: []
    };
}
