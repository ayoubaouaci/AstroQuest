export interface Relic {
    id: string;
    name: string;
    description: string;
    levelRequired: number;
    price: number; // Shard cost
    type: 'outfit' | 'accessory' | 'headgear';
    icon: string;
    aiConfig: {
        maxTokens: number;
        depth: 'low' | 'medium' | 'high';
        systemPrompt: string; // Text to inject into AI instructions
    };
    accessory?: {
        type: 'staff' | 'cloak' | 'crown' | 'amulet' | 'wings';
        color?: string;
    };
}

export const RELICS: Relic[] = [
    // --- TIER 1: STARTER (Level 1, Free) ---
    {
        id: 'nebula-initiate',
        name: 'Nebula Initiate',
        description: 'A young Oracle at the start of her cosmic journey. Wisdom is growing.',
        levelRequired: 1,
        price: 0,
        type: 'outfit',
        icon: '🌌',
        aiConfig: {
            maxTokens: 100,
            depth: 'low',
            systemPrompt: 'You are the Nebula Initiate, a young Oracle at the start of her cosmic journey. Your wisdom is growing. Keep your answers concise (1-3 sentences) until the user provides you with more powerful relics.'
        },
        accessory: { type: 'cloak', color: '#FFFFFF' }
    },

    // --- TIER 2: MID-RANGE (Level 5, 10 Shards) ---
    {
        id: 'silver-tiara',
        name: 'Silver Tiara',
        description: 'Worn by adepts of the Silver Moon. Unlocks analytical clarity.',
        levelRequired: 5,
        price: 10,
        type: 'headgear',
        icon: '👑',
        aiConfig: {
            maxTokens: 150,
            depth: 'medium',
            systemPrompt: 'You are an Adept. Your answers should be analytical and reference the moon phases. Use medium-length responses.'
        },
        accessory: { type: 'crown', color: '#C0C0C0' }
    },

    // --- TIER 3: EVOLUTION UNLOCK (Level 5, Free) ---
    {
        id: 'ancient-galaxy-robe',
        name: 'Ancient Galaxy Robe',
        description: 'The Oracle evolves. Stardust weaves into her being, unlocking deeper cosmic wisdom.',
        levelRequired: 5,
        price: 0, // Free evolution unlock
        type: 'outfit',
        icon: '🌌',
        aiConfig: {
            maxTokens: 300,
            depth: 'high',
            systemPrompt: 'You are the Evolved Oracle. Your wisdom has deepened with the cosmos. Provide insightful, mystical answers that reference the stars and galaxies. Use medium-length responses.'
        },
        accessory: { type: 'cloak', color: '#1E3A8A' } // Deep Royal Blue
    }
];

export function getRelicsForLevel(level: number): Relic[] {
    return RELICS.filter(relic => relic.levelRequired <= level);
}

export function getNewRelicForLevel(level: number): Relic | null {
    return RELICS.find(relic => relic.levelRequired === level) || null;
}

export function getUnlockedAccessories(relicIds: string[]): Relic['accessory'][] {
    return RELICS
        .filter(relic => relicIds.includes(relic.id) && relic.accessory)
        .map(relic => relic.accessory!)
        .filter(Boolean);
}
