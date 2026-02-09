export interface UserProgress {
    totalXP: number;
    level: number;
    questsCompleted: number;
}

const MAX_LEVEL = 20; // Level cap for initial release

export function calculateLevel(xp: number): number {
    // Level formula: level = floor(sqrt(xp / 100))
    // Level 1: 0-99 XP
    // Level 2: 100-399 XP
    // Level 3: 400-899 XP
    // etc.
    const calculatedLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
    return Math.min(calculatedLevel, MAX_LEVEL); // Cap at max level
}

export function getXPForNextLevel(currentLevel: number): number {
    // XP needed for next level
    return currentLevel * currentLevel * 100;
}

export function getXPProgress(xp: number): { current: number; needed: number; percentage: number } {
    const level = calculateLevel(xp);
    const xpForCurrentLevel = (level - 1) * (level - 1) * 100;
    const xpForNextLevel = level * level * 100;

    const current = xp - xpForCurrentLevel;
    const needed = xpForNextLevel - xpForCurrentLevel;
    const percentage = (current / needed) * 100;

    return { current, needed, percentage };
}

export function addXP(currentXP: number, xpToAdd: number): { newXP: number; leveledUp: boolean; newLevel: number } {
    const oldLevel = calculateLevel(currentXP);
    const newXP = currentXP + xpToAdd;
    const newLevel = calculateLevel(newXP);

    return {
        newXP,
        leveledUp: newLevel > oldLevel,
        newLevel,
    };
}

/**
 * Calculate shard reward for leveling up
 * Base: +1 shard per level
 * Milestones: bonus shards at levels 5, 10, 15, 20
 */
export function getShardRewardForLevel(level: number): number {
    let reward = 1.0; // Base reward for any level up

    // Milestone bonuses
    if (level === 5) reward += 2.0;   // Total: 3.0 shards
    if (level === 10) reward += 5.0;  // Total: 6.0 shards
    if (level === 15) reward += 10.0; // Total: 11.0 shards
    if (level === 20) reward += 20.0; // Total: 21.0 shards (max level!)

    return reward;
}

/**
 * Get max level cap
 */
export function getMaxLevel(): number {
    return MAX_LEVEL;
}
