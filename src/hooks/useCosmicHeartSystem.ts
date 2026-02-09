'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { StarSystem } from '@/lib/starSystem';

interface CrackState {
    stage: 0 | 1 | 2 | 3 | 4 | 5;
    isPulsing: boolean;
    pulseIntensity: number;
}

interface MiracleState {
    isActive: boolean;
    intensity: number;
    lastTriggered: number;
    count: number;
}

export interface CosmicHeartState {
    lastVisit: number;
    streak: number;
    interactionCount: number;
    mood: number; // 0-100
    visualVariant: {
        hue: number;
        rotationSpeed: number;
        auraDensity: number;
        pulsePattern: 'smooth' | 'staggered' | 'wave';
    };
    crackState: CrackState;
    shouldPulseCrack: boolean;
    miracleState: MiracleState;
    starCoins: Array<{
        id: string;
        value: 1 | 3 | 5;
        position: { x: number; y: number };
        createdAt: number;
        collected: boolean;
    }>;
    emotionalLayer: 'dormant' | 'awakened' | 'radiant' | 'ascended';
    miracleActive?: boolean; // Deprecated
}

const DEFAULT_STATE: CosmicHeartState = {
    lastVisit: Date.now(),
    streak: 0,
    interactionCount: 0,
    mood: 50,
    visualVariant: { hue: 280, rotationSpeed: 1, auraDensity: 0.5, pulsePattern: 'smooth' },
    crackState: {
        stage: 0,
        isPulsing: false,
        pulseIntensity: 0
    },
    shouldPulseCrack: false,
    miracleState: {
        isActive: false,
        intensity: 0.8,
        lastTriggered: 0,
        count: 0
    },
    starCoins: [],
    emotionalLayer: 'awakened'
};

export const useCosmicHeartSystem = () => {
    function generateDailyVariant() {
        if (typeof window === 'undefined') return DEFAULT_STATE.visualVariant;

        const now = new Date();
        const seed = now.getDate() + now.getMonth() * 100;

        // Fixed Cosmic Palette: Purple/Indigo range (260 - 290)
        // No more random green/orange shifts
        return {
            hue: 260 + (seed % 30),
            rotationSpeed: 0.8 + ((seed * 53) % 40) / 100,
            auraDensity: 0.5 + ((seed * 29) % 50) / 100,
            pulsePattern: ['smooth', 'staggered', 'wave'][seed % 3] as 'smooth' | 'staggered' | 'wave'
        };
    }

    const [heartState, setHeartState] = useState<CosmicHeartState>({
        ...DEFAULT_STATE
    });

    const [isLoaded, setIsLoaded] = useState(false);

    const calculateCrackStage = useCallback((): 0 | 1 | 2 | 3 | 4 | 5 => {
        const wallet = StarSystem.getWallet();
        const miracles = wallet.transactions.filter(t => t.reason === 'miracle').length;
        const quests = wallet.transactions.filter(t => t.reason === 'daily').length;
        // Mixed Progress Score: Stars + Miracles + Quests
        const score = wallet.totalEarned + miracles + quests;

        // New Slower Thresholds
        if (score >= 1500) return 5;
        if (score >= 1000) return 4;
        if (score >= 600) return 3;
        if (score >= 300) return 2;
        if (score >= 100) return 1;
        return 0;
    }, []);

    const determineEmotionalLayer = useCallback((mood: number): CosmicHeartState['emotionalLayer'] => {
        if (mood <= 30) return 'dormant';
        if (mood <= 60) return 'awakened';
        if (mood <= 90) return 'radiant';
        return 'ascended';
    }, []);

    const triggerCrackPulse = useCallback((intensity: number = 1) => {
        setHeartState(prev => ({
            ...prev,
            crackState: {
                ...prev.crackState,
                isPulsing: true,
                pulseIntensity: intensity
            }
        }));

        setTimeout(() => {
            setHeartState(prev => ({
                ...prev,
                crackState: {
                    ...prev.crackState,
                    isPulsing: false,
                    pulseIntensity: 0
                }
            }));
        }, 1000);
    }, []);

    // Spawn Stars Logic
    const spawnStarCoins = useCallback((intensity: number, position?: { x: number; y: number }) => {
        const coinCount = Math.floor(intensity * 3) + 1; // 1-4 stars
        const newCoins: CosmicHeartState['starCoins'] = [];

        for (let i = 0; i < coinCount; i++) {
            const coinPosition = position || {
                x: 30 + Math.random() * 40,
                y: 30 + Math.random() * 40
            };

            // Star value based on miracle intensity
            let value: 1 | 3 | 5 = 1;
            if (intensity > 0.8) value = 5;
            else if (intensity > 0.5) value = 3;

            newCoins.push({
                id: `star_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
                value,
                position: coinPosition,
                createdAt: Date.now(),
                collected: false
            });
        }

        setHeartState(prev => ({
            ...prev,
            starCoins: [...prev.starCoins, ...newCoins]
        }));

        // Remove old stars after 30s
        setTimeout(() => {
            setHeartState(prev => ({
                ...prev,
                starCoins: prev.starCoins.filter(coin =>
                    !newCoins.some(newCoin => newCoin.id === coin.id)
                )
            }));
        }, 30000);
    }, []);

    // Miracle Trigger
    const triggerMiracle = useCallback((customIntensity?: number) => {
        const now = Date.now();
        const intensity = customIntensity || (0.7 + Math.random() * 0.3);

        // Cooldown check for auto-trigger (not custom/manual)
        // 2 minutes cooldown
        if (!customIntensity && (now - heartState.miracleState.lastTriggered < 120000)) {
            return;
        }

        setHeartState(prev => ({
            ...prev,
            miracleState: {
                isActive: true,
                intensity,
                lastTriggered: now,
                count: prev.miracleState.count + 1
            }
        }));

        // Spawn stars in the center
        spawnStarCoins(intensity, { x: 50, y: 50 });

        // Grant stars to wallet automatically (miracle reward) + spawned coins are extra collectible
        const starValue = intensity > 0.8 ? 5 : intensity > 0.5 ? 3 : 1;
        StarSystem.earnStars(starValue, 'miracle');

        // Allow multiple triggers if needed, remove auto-off if it conflicts with rapid triggers?
        // Actually we want auto-off for the visual effect
        setTimeout(() => {
            setHeartState(prev => ({
                ...prev,
                miracleState: {
                    ...prev.miracleState,
                    isActive: false
                }
            }));
        }, 10000);
    }, [heartState.miracleState.lastTriggered, spawnStarCoins]);

    // Collect Star Coin
    const collectStarCoin = useCallback((starId: string, value: number) => {
        setHeartState(prev => ({
            ...prev,
            starCoins: prev.starCoins.map(coin =>
                coin.id === starId ? { ...coin, collected: true } : coin
            )
        }));

        // Register earnings
        StarSystem.earnStars(value, 'collect');

        // Remove from state after animation
        setTimeout(() => {
            setHeartState(prev => ({
                ...prev,
                starCoins: prev.starCoins.filter(coin => coin.id !== starId)
            }));
        }, 500);
    }, []);

    // Admin Controls
    const setMood = useCallback((mood: number) => {
        const safeMood = Math.max(0, Math.min(100, mood));
        setHeartState(prev => ({
            ...prev,
            mood: safeMood,
            emotionalLayer: determineEmotionalLayer(safeMood)
        }));
    }, [determineEmotionalLayer]);

    const setCrackStage = useCallback((stage: 0 | 1 | 2 | 3 | 4 | 5) => {
        setHeartState(prev => ({
            ...prev,
            crackState: { ...prev.crackState, stage },
            shouldPulseCrack: true
        }));
    }, []);

    const resetSystem = useCallback(() => {
        setHeartState(prev => ({
            ...DEFAULT_STATE,
            visualVariant: prev.visualVariant
        }));
        StarSystem.reset(); // Also reset wallet
        localStorage.removeItem('cosmic_heart_memory');
        localStorage.removeItem('cosmic_heart_last_visit_date');
    }, []);


    // Interaction Handler
    const handleInteraction = useCallback(() => {
        setHeartState(prev => {
            const newMood = Math.min(100, prev.mood + 8);
            const newInteractionCount = prev.interactionCount + 1;
            console.log(`Cosmic Heart Interaction: ${newInteractionCount}`);

            // 5% chance to spawn a bonus star
            if (Math.random() < 0.05 && prev.mood > 50) {
                setTimeout(() => {
                    spawnStarCoins(0.3, {
                        x: 40 + Math.random() * 20,
                        y: 40 + Math.random() * 20
                    });
                    StarSystem.earnStars(1, 'bonus');
                }, 100);
            }

            const currentState = prev.crackState.stage;
            const newCrackStage = calculateCrackStage();

            // PROGRESS CHECK LOGGING
            if (newCrackStage > currentState) {
                console.log(`Crack progress slowed: Stage ${newCrackStage} reached from Interaction!`);
            }

            // Pulse on every interaction for feedback
            triggerCrackPulse(0.8 + (prev.mood / 200));

            const newState: CosmicHeartState = {
                ...prev,
                mood: newMood,
                interactionCount: newInteractionCount,
                emotionalLayer: determineEmotionalLayer(newMood),
                crackState: {
                    ...prev.crackState,
                    stage: newCrackStage
                },
                shouldPulseCrack: newCrackStage > currentState, // Only true triggers state-based pulse effect
                lastVisit: Date.now()
            };

            localStorage.setItem('cosmic_heart_memory', JSON.stringify(newState));
            return newState;
        });
    }, [calculateCrackStage, determineEmotionalLayer, triggerCrackPulse, spawnStarCoins]);

    // Effects ----------------------------------------

    // Pulse Check (State-based)
    useEffect(() => {
        if (heartState.shouldPulseCrack && heartState.crackState.stage > 0) {
            triggerCrackPulse(1);
            setHeartState(prev => ({
                ...prev,
                shouldPulseCrack: false
            }));

            // New: Miracle on Crack Stage Up
            setTimeout(() => {
                triggerMiracle(1);
            }, 500);
        }
    }, [heartState.shouldPulseCrack, heartState.crackState.stage, triggerCrackPulse, triggerMiracle]);

    // Daily Check & Init
    useEffect(() => {
        const saved = localStorage.getItem('cosmic_heart_memory');
        const now = Date.now();
        const dailyVariant = generateDailyVariant();

        // Daily Visit Check for Miracle
        const today = new Date().toDateString();
        const lastVisitDate = localStorage.getItem('cosmic_heart_last_visit_date');
        if (lastVisitDate !== today) {
            localStorage.setItem('cosmic_heart_last_visit_date', today);
            setTimeout(() => triggerMiracle(0.6), 2000);
        }

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const crackStage = parsed.crackState ? parsed.crackState.stage : (parsed.crackStage || 0);
                const miracleState = parsed.miracleState || DEFAULT_STATE.miracleState;

                setHeartState(prev => ({
                    ...prev,
                    ...parsed,
                    visualVariant: dailyVariant, // Force new daily variant (fixed palette)
                    lastVisit: now,
                    crackState: {
                        stage: crackStage,
                        isPulsing: false,
                        pulseIntensity: 0
                    },
                    miracleState: miracleState,
                    starCoins: parsed.starCoins || []
                }));
            } catch (e) {
                console.error("Failed to parse heart memory", e);
            }
        } else {
            // Apply daily variant on client mount
            setHeartState(prev => ({ ...prev, visualVariant: dailyVariant }));
        }
        setIsLoaded(true);
    }, []); // Run once on mount

    // Mood Decay
    useEffect(() => {
        const decayInterval = setInterval(() => {
            setHeartState(prev => {
                const newMood = Math.max(0, prev.mood - 1);
                return {
                    ...prev,
                    mood: newMood,
                    emotionalLayer: determineEmotionalLayer(newMood)
                };
            });
        }, 60000);

        return () => clearInterval(decayInterval);
    }, [determineEmotionalLayer]);

    // Random Miracles
    useEffect(() => {
        const miracleInterval = setInterval(() => {
            const probability = 0.1 + (heartState.streak * 0.02) + (heartState.mood > 70 ? 0.15 : 0) + (heartState.miracleState.count < 5 ? 0.1 : 0);

            if (Math.random() < probability) {
                triggerMiracle();
            }
        }, 1800000); // 30 mins

        return () => clearInterval(miracleInterval);
    }, [heartState.streak, heartState.mood, heartState.miracleState.count, triggerMiracle]);

    // Function to get stats wrapper
    const getStarStats = useCallback(() => {
        return StarSystem.getStats();
    }, []);

    return {
        heartState,
        handleInteraction,
        triggerMiracle,
        collectStarCoin, // New collection handler
        getStarStats,
        spawnStarCoins,
        adminControls: {
            setMood,
            setCrackStage,
            triggerMiracle: () => triggerMiracle(1),
            resetSystem
        }
    };
};
