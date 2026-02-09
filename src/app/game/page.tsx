"use client";

import { PixelCard } from "@/components/ui/PixelCard";
import { DialogueBox } from "@/components/ui/DialogueBox";
import UltimateCosmicCompass from "@/components/CosmicCompass/UltimateVersion";




import { AscensionEffect } from "@/components/ui/AscensionEffect";
import { Astrolabe } from "@/components/ui/Astrolabe";
import { LevelUpAnimation } from "@/components/ui/LevelUpAnimation";
import { VictorySplash } from "@/components/ui/VictorySplash";
import Image from "next/image";
import { RelicVault } from "@/components/ui/RelicVault";
import { CosmicAltar } from "@/components/ui/CosmicAltar";
import { AdminPanel } from "@/components/ui/AdminPanel";
import { Sanctum } from "@/components/ui/Sanctum";
import MoonSignIcon from "@/components/MoonSignIcon";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Package, ShoppingBag, Scroll, Shield } from "lucide-react";
import { QuestLog } from "@/components/ui/QuestLog";
import { CosmicHeart } from "@/components/CosmicHeart/CosmicHeart";
import StarCoin from "@/components/CosmicHeart/StarCoin";
import { useCosmicHeartSystem } from "@/hooks/useCosmicHeartSystem";
import { StarSystem, StarWallet } from "@/lib/starSystem";
import { CosmicAdminPanel } from "@/components/admin/CosmicAdminPanel";
import Link from "next/link";
import { calculateNatalChart, getCosmicReading, NatalChart } from "@/lib/cosmic-brain/calculations";
import { generateCosmicSignature, getSignatureSummary, CosmicSignature } from "@/lib/cosmic-brain/cosmic-signature-generator";
import { ZODIAC_SIGNS, getZodiacByDate } from "@/lib/zodiac-data";

import { generateDailyQuests, getDailyFortune, Quest } from "@/lib/cosmic-brain/quest-generator";
import { addXP, calculateLevel, getShardRewardForLevel } from "@/lib/cosmic-brain/xp-system";
import { getRelicsForLevel, getNewRelicForLevel, getUnlockedAccessories, Relic, RELICS } from "@/lib/cosmic-brain/relic-system";
import { soundEngine } from "@/lib/sounds";
import { ItemContext } from "@/lib/cosmic-brain/gemini-service";
interface UserProfile {
  name: string;
  birthDate?: string;
  birthTime?: string;
  birthLocation: string;
  latitude: number;
  longitude: number;
  chart?: NatalChart;
  cosmicSignature?: CosmicSignature;
  level?: number;
  isAdmin?: boolean;
}

interface GameProgress {
  totalXP: number;
  level: number;
  questsCompleted: number;
  lastQuestDate: string;
  quests: Quest[];
  unlockedRelicIds: string[];
  shards: number;
  dailyRewardClaimed: boolean;
  prestige: number;
  equippedItems: {
    outfit: string;
    headgear: string;
    accessory: string;
  };
  unlockedSanctumItemIds: string[];
  foundRelics: string[];
}

import { AscensionNotification } from "@/components/ui/AscensionNotification";

const HIDDEN_RELICS = [
  {
    id: 'relic-taurus',
    title: 'ANCIENT TAURUS TABLET',
    description: 'A stone tablet glowing with the grounded power of the Bull.',
    image: '/relic-taurus.png',
    position: 'bottom-[25%] left-[5%] w-[15%] h-[15%]' // Lower Left Bookshelf
  },
  {
    id: 'relic-capricorn',
    title: 'MYSTIC CAPRICORN RUNE',
    description: 'Obsidian etched with the ambition of the Sea-Goat.',
    image: '/relic-capricorn.png',
    position: 'top-[15%] right-[8%] w-[12%] h-[12%]' // Upper Right Bookshelf
  },
  {
    id: 'relic-virgo',
    title: 'LOST VIRGO SCROLL',
    description: 'Parchment preserving the meticulous wisdom of the Maiden.',
    image: '/relic-virgo.png',
    position: 'top-[45%] right-[20%] w-[10%] h-[10%]' // Center Right Bookshelf
  }
];

import { ApplicationState } from "@/lib/cosmic-brain/engine-types";

// User Provided JSON State
const MOCK_ENGINE_STATE: ApplicationState = {
  application_state: {
    user_profile: {
      name: "Ayoub",
      birth_data: { date: "2024-01-25", time: "14:30", city: "Paris" }
    },
    astrological_engine: {
      chart_points: {
        ascendant: { sign: "Virgo", degree: 165.5 },
        sun: { sign: "Capricorn", degree: 284.2, house: 4, influence: "High" },
        moon: { "sign": "Taurus", "degree": 41.8, "house": 8, "influence": "Medium" }
      },
      aspect_lines: [
        { from: "Sun", to: "Moon", type: "Trine", color: "#00FFFF", active: true }
      ]
    },
    oracle_module: {
      active_card: "CAPRICORN_ARTIFACT",
      dialogue_stream: {
        intro: "The cosmic currents of Algeria in 2004 shaped your path, Ayoub. A sky fixed in determination.",
        analysis: "With your Ascendant in Virgo and Sun in Capricorn, the Earth element dominates your chart. You ground the ethereal into the tangible.",
        unlock_cost: 0.5,
        wallet_balance: 3.5
      }
    },
    rendering_engine: {
      canvas_id: "natal_chart_overlay",
      dominant_element: "earth", // Triggers Emerald #2ECC71
      ascendant_degree: 165.5,
      draw_sequence: [
        { "task": "draw_zodiac_wheel", "style": "professional" },
        { "task": "draw_house_numbers", "style": "pixel_small" },
        { "task": "set_ascendant", "degree": 165.5, "label": "AC" },
        /* PLANETARY SUITE */
        { "task": "place_planet", "id": "sun", "sign": "Capricorn", "exact_degree": 284.2 },
        { "task": "place_planet", "id": "moon", "sign": "Taurus", "exact_degree": 41.8 },
        { "task": "place_planet", "id": "mercury", "sign": "Aquarius", "exact_degree": 300.5 },
        { "task": "place_planet", "id": "venus", "sign": "Capricorn", "exact_degree": 275.0 },
        { "task": "place_planet", "id": "mars", "sign": "Capricorn", "exact_degree": 278.4 },
        { "task": "place_planet", "id": "jupiter", "sign": "Taurus", "exact_degree": 55.2 },
        { "task": "place_planet", "id": "saturn", "sign": "Pisces", "exact_degree": 340.1 },
        { "task": "place_planet", "id": "uranus", "sign": "Taurus", "exact_degree": 50.5 },
        { "task": "place_planet", "id": "neptune", "sign": "Pisces", "exact_degree": 358.9 },
        { "task": "place_planet", "id": "pluto", "sign": "Aquarius", "exact_degree": 301.2 }
      ],
      animation: {
        "type": "fade_in_complex",
        "duration_ms": 2000
      }
    }
  }
};



import { CelestialMap } from "@/components/ui/CelestialMap";
import { Compass } from "lucide-react";

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reading, setReading] = useState<string>("Hello, I am your Seer today. Do you want me to reveal your zodiac, moons, and your day/month/year forecast?");
  const [engineState, setEngineState] = useState<ApplicationState['application_state'] | null>(null);
  const [showRendering, setShowRendering] = useState(false); // Visual Transition Trigger
  const [showEyeGlow, setShowEyeGlow] = useState(false); // Oracle Reaction
  const [showSignatureCircle, setShowSignatureCircle] = useState(false);
  const [cosmicSignature, setCosmicSignature] = useState<CosmicSignature | null>(null);

  // Cosmic Heart Memory System
  const { heartState, handleInteraction, adminControls, collectStarCoin } = useCosmicHeartSystem();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  // Sync Star Wallet - Fix Hydration Mismatch by initializing effective default
  const [starWallet, setStarWallet] = useState<StarWallet>({
    balance: 0,
    totalEarned: 0,
    totalSpent: 0,
    transactions: []
  });

  useEffect(() => {
    // Immediate sync on mount
    setStarWallet(StarSystem.getWallet());

    const interval = setInterval(() => {
      setStarWallet(StarSystem.getWallet());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [progress, setProgress] = useState<GameProgress>({
    totalXP: 0,
    level: 1,
    questsCompleted: 0,
    lastQuestDate: "",
    quests: [],
    unlockedRelicIds: ['starter-crystal'],
    shards: 5.0,
    dailyRewardClaimed: false,
    prestige: 0,
    equippedItems: {
      outfit: 'nebula-initiate',
      headgear: '',
      accessory: ''
    },
    unlockedSanctumItemIds: ['nebula-initiate'],
    foundRelics: [],
  });

  // SIMULATION: Activate Engine Mode on Mount
  useEffect(() => {
    // Allow seamless transition. In a real app this would be an API fetch.
    // We set the engine state to the mock data.
    setEngineState(MOCK_ENGINE_STATE.application_state);

    // Sync Shards from Engine
    setProgress(prev => ({
      ...prev,
      shards: MOCK_ENGINE_STATE.application_state.oracle_module.dialogue_stream.wallet_balance
    }));
  }, []);

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAscension, setShowAscension] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [levelUpShardReward, setLevelUpShardReward] = useState(0);

  const handleLogout = () => {
    if (confirm("Are you sure you want to reset your identity? This will clear your progress.")) {
      // ... existing logout logic
      setEngineState(null); // Clear Engine State
      localStorage.removeItem("astroquest_profile");
      localStorage.removeItem("astroquest_progress");
      localStorage.removeItem("astroquest_chat_history");
      setProfile(null);
      setProgress({
        totalXP: 0,
        level: 1,
        questsCompleted: 0,
        lastQuestDate: "",
        quests: [],
        unlockedRelicIds: ['starter-crystal'],
        shards: 5.0,
        dailyRewardClaimed: false,
        prestige: 0,
        equippedItems: { outfit: 'nebula-initiate', headgear: '', accessory: '' },
        unlockedSanctumItemIds: ['nebula-initiate'],
        foundRelics: [],
      });
      window.location.href = '/';
    }
  };
  const [showVault, setShowVault] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [showAltar, setShowAltar] = useState(false);
  const [showShardBonus, setShowShardBonus] = useState(false);
  const [useBookView, setUseBookView] = useState(false);
  const [showAscensionEffect, setShowAscensionEffect] = useState(false);
  const [showVictorySplash, setShowVictorySplash] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [oracleQuestion, setOracleQuestion] = useState("");
  const [showQuestLog, setShowQuestLog] = useState(false);
  const [showCompass, setShowCompass] = useState(false);
  const [showStars, setShowStars] = useState(true);


  // Void Event Handlers Removed

  useEffect(() => {
    // 1. Check for existing profile
    const saved = localStorage.getItem("astroquest_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.name.toLowerCase() === 'ayoub') {
          parsed.isAdmin = true;
        }
        setProfile(parsed);

        // Restore cosmic signature if it exists
        // Restore cosmic signature if it exists, otherwise generate it
        if (parsed.cosmicSignature) {
          setCosmicSignature(parsed.cosmicSignature);
          setReading(getSignatureSummary(parsed.cosmicSignature));
        } else {
          // AUTO-GENERATE MISSING SIGNATURE (Fix for missing Compass)
          const sig = generateCosmicSignature(
            parsed.birthDate || "1990-01-01",
            parsed.birthTime || "12:00",
            parsed.latitude || 0,
            parsed.longitude || 0,
            parsed.birthLocation || "Unknown"
          );
          parsed.cosmicSignature = sig;
          setCosmicSignature(sig);
          setReading(getSignatureSummary(sig));
          localStorage.setItem("astroquest_profile", JSON.stringify(parsed));
          setProfile(parsed); // Ensure state has the signature
        }
        return; // Profile loaded, stop here
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }

    // 2. If NO profile, check for registration data from Home Page
    const registrationData = localStorage.getItem("astroUserData");
    if (registrationData) {
      try {
        const data = JSON.parse(registrationData);
        if (data.name && data.day && data.month && data.year) {
          console.log("Migrating registration data...", data);

          // Construct Date
          // Pads single digits with 0
          const day = data.day.toString().padStart(2, '0');
          const month = data.month.toString().padStart(2, '0');
          const dateStr = `${data.year}-${month}-${day}`;
          const timeStr = data.time || "12:00";
          const locationStr = data.city || "Unknown";

          // Default coordinates (User can refine later if needed, but this gets them in-game)
          const lat = 0;
          const long = 0;

          // Generate Chart & Signature
          const chart = calculateNatalChart(dateStr, timeStr, lat, long);
          const signature = generateCosmicSignature(dateStr, timeStr, lat, long, locationStr);
          const initialReading = getSignatureSummary(signature); // Immediate reading

          const newProfile: UserProfile = {
            name: data.name,
            birthDate: dateStr,
            birthTime: timeStr,
            birthLocation: locationStr,
            latitude: lat,
            longitude: long,
            chart: chart,
            cosmicSignature: signature,
            isAdmin: data.name.toLowerCase() === 'ayoub'
          };

          // Save & Set
          setProfile(newProfile);
          setCosmicSignature(signature);
          setReading(initialReading);
          localStorage.setItem("astroquest_profile", JSON.stringify(newProfile));

          // Clean up old data to prevent re-triggering (optional, but good hygiene)
          // localStorage.removeItem("astroUserData"); 

          // Trigger Intro Animations
          soundEngine.playStateChange();
          setShowSignatureCircle(true);
          setTimeout(() => setShowAscension(true), 2000); // Novice Ascension
        }
      } catch (e) {
        console.error("Failed to migrate registration data", e);
      }
    }

    const savedProgress = localStorage.getItem("astroquest_progress");
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        if (!parsed.unlockedRelicIds) parsed.unlockedRelicIds = ['starter-crystal'];
        if (parsed.shards === undefined) parsed.shards = 5.0;
        if (parsed.dailyRewardClaimed === undefined) parsed.dailyRewardClaimed = false;
        if (!parsed.equippedItems) parsed.equippedItems = { outfit: 'starter-veil', headgear: '', accessory: '' };
        if (!parsed.unlockedSanctumItemIds) parsed.unlockedSanctumItemIds = ['starter-veil', 'nebula-initiate'];
        parsed.equippedItems.outfit = 'nebula-initiate';
        setProgress(parsed);
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, []);
  useEffect(() => {
    const syncQuests = async () => {
      if (profile && profile.chart) {
        const today = new Date().toISOString().split('T')[0];
        const lastCompletionDate = localStorage.getItem("astroquest_quest_completion_date");

        // If we completed quests yesterday (or before), we need new ones today
        const completionStale = lastCompletionDate && lastCompletionDate !== today;

        // Classic check: Do we have quests for today?
        const hasTodayQuests = progress.lastQuestDate === today && progress.quests.length > 0;

        if (hasTodayQuests && !completionStale) {
          console.log("Quests active for today.");
          return;
        }

        // Logic: Generate if (LastQuestDate is old OR Quests are empty OR Completion was from old date)
        const needsNewQuests = progress.lastQuestDate !== today || progress.quests.length === 0 || completionStale;

        if (needsNewQuests) {
          console.log("Generating new daily quests...");
          const newQuests = await generateDailyQuests(profile.chart, new Date(), { ...profile, level: progress.level });

          const updatedProgress = {
            ...progress,
            quests: newQuests,
            lastQuestDate: today,
            dailyRewardClaimed: false, // Reset reward claim for new day
          };

          setProgress(updatedProgress);
          localStorage.setItem("astroquest_progress", JSON.stringify(updatedProgress));

          // Clear old completion date if we just generated new ones for today
          // Wait, if I generate new ones today, I haven't completed them yet.
          // So I should ensure the completion flag is NOT set for 'today' until I finish them.
          // If 'lastCompletionDate' was yesterday, it remains 'yesterday' until I finish today's.
          // The check `lastCompletionDate !== today` ensures we don't think we finished TODAY'S quests.
        }
      }
    };

    syncQuests();
  }, [profile, progress.lastQuestDate, progress.quests.length]);

  useEffect(() => {
    if (progress.level >= 5) {
      const needsEvolution = !progress.unlockedSanctumItemIds.includes('ancient-galaxy-robe') ||
        progress.equippedItems.outfit !== 'ancient-galaxy-robe';

      if (needsEvolution) {
        setProgress(prev => {
          const updated = {
            ...prev,
            unlockedSanctumItemIds: prev.unlockedSanctumItemIds.includes('ancient-galaxy-robe')
              ? prev.unlockedSanctumItemIds
              : [...prev.unlockedSanctumItemIds, 'ancient-galaxy-robe'],
            equippedItems: {
              ...prev.equippedItems,
              outfit: 'ancient-galaxy-robe'
            }
          };
          localStorage.setItem("astroquest_progress", JSON.stringify(updated));
          return updated;
        });
      }
    } else if (progress.level < 5 && progress.equippedItems.outfit === 'ancient-galaxy-robe') {
      setProgress(prev => {
        const updated = {
          ...prev,
          equippedItems: {
            ...prev.equippedItems,
            outfit: 'nebula-initiate'
          }
        };
        localStorage.setItem("astroquest_progress", JSON.stringify(updated));
        return updated;
      });
    }
  }, [progress.level]);


  const handleAstrolabeComplete = (data: {
    name: string;
    date: string;
    time: string;
    location: string;
    latitude: number;
    longitude: number;
  }) => {
    const chart = calculateNatalChart(data.date, data.time, data.latitude, data.longitude);
    const newReading = getCosmicReading(chart, data.location);

    // Generate Cosmic Signature
    const signature = generateCosmicSignature(
      data.date,
      data.time,
      data.latitude,
      data.longitude,
      data.location
    );

    const newProfile: UserProfile = {
      name: data.name,
      birthDate: data.date,
      birthTime: data.time,
      birthLocation: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      chart: chart,
      cosmicSignature: signature,
      isAdmin: data.name.toLowerCase() === 'ayoub'
    };

    setProfile(newProfile);
    setCosmicSignature(signature);
    setReading(getSignatureSummary(signature));
    localStorage.setItem("astroquest_profile", JSON.stringify(newProfile));

    // Show Signature Circle Animation
    soundEngine.playStateChange();
    setShowSignatureCircle(true);

    // Trigger First Ascension (Novice)
    setTimeout(() => setShowAscension(true), 2000);

    // RENDER ENGINE TRANSITION: Trigger Visual Sequence
    if (engineState?.rendering_engine) {
      setTimeout(() => setShowRendering(true), 3000);
    }
  };

  const handleQuestToggle = (questId: string) => {
    const updatedQuests = progress.quests.map(q => {
      if (q.id === questId) {
        const newCompleted = !q.completed;

        if (newCompleted && !q.completed) {
          soundEngine.playComplete();
          // AWARD STARS
          StarSystem.earnStars(5, 'daily');

          const xpResult = addXP(progress.totalXP, q.xp);

          const updatedProgress = {
            ...progress,
            quests: progress.quests.map(quest =>
              quest.id === questId ? { ...quest, completed: true } : quest
            ),
            totalXP: xpResult.newXP,
            level: xpResult.newLevel,
            questsCompleted: progress.questsCompleted + 1,
          };

          // Calculate true count from array to avoid desync
          const currentTrueCount = progress.quests.filter(q => q.completed).length;
          const newCompletedCount = currentTrueCount + 1;
          const REWARD_THRESHOLD = 3;
          // Check if ALL daily quests are now complete (assuming 3 per day)
          const allDailyComplete = newCompletedCount >= progress.quests.length;

          if (allDailyComplete) {
            // Mark today as fully complete
            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem("astroquest_quest_completion_date", today);

            // Trigger GRAND VICTORY Splash for full set completion
            updatedProgress.shards = Number((updatedProgress.shards + 0.5).toFixed(1));
            setShowVictorySplash(true);
          } else {
            // Intermediate steps or just standard reward threshold if we kept that logic
            // logic says "every 3 quests" but daily is exactly 3. So this aligns.
            if (newCompletedCount > 0 && newCompletedCount % REWARD_THRESHOLD === 0) {
              // Redundant if we use allDailyComplete but keeping for safety if quests > 3
              if (!allDailyComplete) { // Avoid double reward if logic overlaps
                updatedProgress.shards = Number((updatedProgress.shards + 0.5).toFixed(1));
                setShowVictorySplash(true);
              }
            } else {
              soundEngine.playZoom();
            }
          }

          if (xpResult.leveledUp) {
            const newRelic = getNewRelicForLevel(xpResult.newLevel);
            if (newRelic && !updatedProgress.unlockedRelicIds.includes(newRelic.id)) {
              updatedProgress.unlockedRelicIds = [...updatedProgress.unlockedRelicIds, newRelic.id];
            }

            const shardReward = getShardRewardForLevel(xpResult.newLevel);
            updatedProgress.shards = updatedProgress.shards + shardReward;
            setLevelUpShardReward(shardReward);
          }


          setProgress(updatedProgress);
          localStorage.setItem("astroquest_progress", JSON.stringify(updatedProgress));

          if (xpResult.leveledUp) {
            setNewLevel(xpResult.newLevel);
            setShowLevelUp(true);
            soundEngine.playLevelUp();

            // Trigger Ascension Card for milestones
            if ([5, 10, 15].includes(xpResult.newLevel)) {
              setShowAscension(true);
            }
          }

          return { ...q, completed: true };
        } else if (!newCompleted && q.completed) {
          const xpResult = addXP(progress.totalXP, -q.xp);

          const updatedProgress = {
            ...progress,
            quests: progress.quests.map(quest =>
              quest.id === questId ? { ...quest, completed: false } : quest
            ),
            totalXP: Math.max(0, xpResult.newXP),
            level: xpResult.newLevel,
            questsCompleted: Math.max(0, progress.questsCompleted - 1),
          };

          // If unchecking, removed completion status
          const today = new Date().toISOString().split('T')[0];
          if (localStorage.getItem("astroquest_quest_completion_date") === today) {
            localStorage.removeItem("astroquest_quest_completion_date");
          }

          setProgress(updatedProgress);
          localStorage.setItem("astroquest_progress", JSON.stringify(updatedProgress));

          return { ...q, completed: false };
        }
      }
      return q;
    });
  };

  const handleSpendShards = (amount: number) => {
    setProgress(prev => {
      const rest = prev.shards - amount;
      const updated = { ...prev, shards: rest < 0 ? 0 : Number(rest.toFixed(1)) };
      localStorage.setItem("astroquest_progress", JSON.stringify(updated));
      return updated;
    });
  };

  const handleRefillShards = (amount: number = 10) => {
    setProgress(prev => {
      const updated = { ...prev, shards: prev.shards + amount };
      localStorage.setItem("astroquest_progress", JSON.stringify(updated));
      return updated;
    });
  };

  const handlePrestige = () => {
    if (progress.level < 20) return;
    soundEngine.playLevelUp();
    setProgress(prev => {
      const updated: GameProgress = {
        ...prev,
        level: 1,
        totalXP: 0,
        prestige: (prev.prestige || 0) + 1,
      };
      localStorage.setItem("astroquest_progress", JSON.stringify(updated));
      return updated;
    });
    setNewLevel(1);
    setShowLevelUp(true);
  };

  const handleSetLevel = (level: number) => {
    setProgress(prev => {
      const updated = { ...prev, level, totalXP: (level - 1) * (level - 1) * 100 };
      localStorage.setItem("astroquest_progress", JSON.stringify(updated));
      return updated;
    });
    setNewLevel(level);
  };

  const handleSetXP = (xp: number) => {
    const newLvl = calculateLevel(xp);
    setProgress(prev => {
      const updated = { ...prev, totalXP: xp, level: newLvl };
      localStorage.setItem("astroquest_progress", JSON.stringify(updated));
      return updated;
    });
    if (newLvl !== progress.level) setNewLevel(newLvl);
  };


  const handleSetShards = (shards: number) => {
    setProgress(prev => {
      const updated = { ...prev, shards };
      localStorage.setItem("astroquest_progress", JSON.stringify(updated));
      return updated;
    });
  };

  const [showSanctum, setShowSanctum] = useState(false);

  const handlePurchaseItem = (item: Relic) => {
    if (progress.shards >= item.price) {
      setProgress(prev => {
        const updated = {
          ...prev,
          shards: prev.shards - item.price,
          unlockedSanctumItemIds: [...prev.unlockedSanctumItemIds, item.id]
        };
        localStorage.setItem("astroquest_progress", JSON.stringify(updated));
        return updated;
      });
      soundEngine.playStateChange();
    }
  };

  const handleEquipItem = (item: Relic) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        equippedItems: {
          ...prev.equippedItems,
          [item.type]: item.id
        }
      };
      localStorage.setItem("astroquest_progress", JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetQuests = async () => {
    if (!profile || !profile.chart) return;
    const newQuests = await generateDailyQuests(profile.chart, new Date(), { name: profile.name, birthLocation: profile.birthLocation, level: progress.level });
    setProgress(prev => {
      const updated = { ...prev, quests: newQuests, questsCompleted: 0 };
      localStorage.setItem("astroquest_progress", JSON.stringify(updated));
      return updated;
    });
  };

  const allQuestsComplete = progress.quests.length > 0 && progress.quests.every(q => q.completed);
  const dailyFortune = profile?.chart ? getDailyFortune(profile.chart) : "";
  const unlockedRelics = getRelicsForLevel(progress.level).filter(r =>
    progress.unlockedRelicIds.includes(r.id)
  );
  const accessories = getUnlockedAccessories(progress.unlockedRelicIds);

  // Hidden Relic System
  const [activeRelic, setActiveRelic] = useState<typeof HIDDEN_RELICS[0] | null>(null);

  const handleDiscoverRelic = (relic: typeof HIDDEN_RELICS[0]) => {
    if (progress.foundRelics?.includes(relic.id)) return;

    soundEngine.playComplete(); // "Discovery" sound

    // Add Shard Reward immediately
    setProgress(prev => {
      const updated = {
        ...prev,
        shards: prev.shards + 0.5,
        foundRelics: [...(prev.foundRelics || []), relic.id]
      };
      localStorage.setItem("astroquest_progress", JSON.stringify(updated));
      return updated;
    });

    setActiveRelic(relic);
    // Trigger visual feedback (optional sparkle if needed, but modal is strong enough)
  };

  return (

    <main className="fixed inset-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-black !border-0 !m-0 !p-0">

      {/* BACKGROUND SCENE CONTAINER - Dynamically Pans Up when Chat is Open to reveal Seer */}
      <div className={`absolute inset-0 w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] ${isChatOpen ? 'translate-y-[-8%]' : 'translate-y-0'}`}>
        {/* Background System */}
        <div className="absolute inset-0 z-[1]">
          <div className="block md:hidden relative w-full h-full">
            <Image
              src="/mobile-bg2.png"
              alt="Cosmic Library Portrait"
              fill
              className="object-cover object-center opacity-90"
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkbG/fDgADqAHS/wz6+AAAAABJRU5ErkJggg=="
            />
            {/* MOBILE HOTSPOTS */}
            {HIDDEN_RELICS.map(relic => (
              !progress.foundRelics?.includes(relic.id) && (
                <div
                  key={relic.id}
                  className={`absolute ${relic.position} z-20 cursor-pointer opacity-30 hover:opacity-100 transition-opacity duration-500`}
                  onClick={() => handleDiscoverRelic(relic)}
                >
                  <div className="w-full h-full bg-white/10 rounded-full animate-pulse blur-xl mix-blend-overlay" />
                </div>
              )
            ))}
          </div>

          {/* Desktop Background (Landscape) */}
          <div className="hidden md:block relative w-full h-full">
            <Image
              src="/fantasy-library-bg-v2.png"
              alt="Cosmic Library Landscape"
              fill
              className="object-cover opacity-90"
              priority
              quality={90}
            />
          </div>

          {/* Global Overlays */}
          <div className="absolute inset-0 bg-midnight-purple/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </div>

        {/* SEER PRESENCE (Asset 1.2) - The Physical Entity */}
        {/* Layered Z-5: Above Background, Below Content (Z-10) */}
        <motion.div
          className="absolute bottom-[35%] left-1/2 -translate-x-1/2 z-[2] w-full max-w-[240px] h-[45vh] pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: isChatOpen ? 1 : (showAltar || showVault || showSanctum || showQuestLog || showCompass) ? 0 : 0.9 }}
          transition={{ duration: 1 }}
        >
          {/* ORB CONTAINER (CosmicHeart) */}
          <div className="relative w-full h-full flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
            {/* The Heart Itself */}
            <CosmicHeart
              heartState={heartState}
              onInteraction={handleInteraction}
              onStarCollect={collectStarCoin}
              zodiacSymbol={(() => {
                if (profile?.chart?.chart_points?.sun?.sign) {
                  const sign = ZODIAC_SIGNS.find(z => z.name === profile.chart!.chart_points!.sun!.sign!)
                  return sign ? sign.symbol : "★";
                }
                if (profile?.birthDate) {
                  return getZodiacByDate(new Date(profile.birthDate)).symbol;
                }
                return "∞";
              })()}
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {showRendering && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute bottom-[80%] left-1/2 -translate-x-1/2 z-[10] pointer-events-none"
            >
              <CelestialMap engineData={engineState?.rendering_engine} />
            </motion.div>
          )}
        </AnimatePresence>


        {/* BALCONY RAILING (Generated Asset) */}
        {/* Layered Z-3: Foreground Element (Covers Seer Bottom) */}
        <div className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 z-[5] w-[180%] h-[100%] scale-[1.2] origin-bottom pointer-events-none">
          <Image
            src="/balconye-railing.png"
            alt="Balcony Railing"
            fill
            className="object-cover object-center opacity-100"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>

      {/* UI LAYER (Z-20) - Content Overlays */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col">

        {/* COSMIC HEART - Centered Core */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="relative pointer-events-auto">

            {/* Render Collectible Stars */}
            {showStars && heartState.starCoins.map(star => (
              <StarCoin
                key={star.id}
                id={star.id}
                value={star.value}
                position={star.position}
                onCollect={(val: number) => {
                  collectStarCoin(star.id, val);
                  soundEngine.playClick(); // Feedback sound
                  setStarWallet(StarSystem.getWallet()); // Immediate update
                }}
              />
            ))}
          </div>
        </div>

        {/* HEADER AREA */}
        <div className="w-full flex justify-between items-start p-4 md:p-6 pointer-events-auto">
          {/* Left: User Status */}
          <div className="flex flex-col gap-2">
            {/* Level Badge */}
            <div className="relative group cursor-pointer" onClick={() => setShowAscension(true)}>
              <div className="absolute inset-0 bg-magic-gold blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-black/60 border border-magic-gold/50 px-4 py-2 rounded-full flex items-center gap-3 backdrop-blur-md">
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-magic-gold flex items-center justify-center bg-midnight-purple shadow-[0_0_15px_rgba(255,215,0,0.4)] overflow-hidden"
                    suppressHydrationWarning
                  >
                    <Image
                      src={progress.level >= 5 ? "/seer-stage-2.png" : "/seer-stage-1.2.png"}
                      alt="Seer Icon"
                      width={40}
                      height={40}
                      className="object-cover w-full h-full scale-125"
                    />
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 bg-cyan-400 text-[10px] font-bold text-black px-1.5 py-0.5 rounded-sm border border-white z-10"
                    suppressHydrationWarning
                  >
                    {progress.level}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-magic-gold/80 uppercase tracking-widest">Acolyte</span>
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                    <motion.div
                      className="h-full bg-gradient-to-r from-magic-gold to-yellow-200"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ((progress.totalXP % 100) / 100) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shard Counter */}
            <div className="relative group cursor-pointer mt-1" onClick={() => setShowSanctum(true)}>
              <div className="relative bg-black/60 border border-cyan-400/30 px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md hover:border-cyan-400/60 transition-colors">
                <div className="w-2 h-2 rotate-45 bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.8)] animate-pulse" />
                <span className="font-mono text-cyan-400 text-xs tracking-wider">{progress.shards.toFixed(1)} SHARDS</span>
              </div>
            </div>

            {/* Star Counter */}
            <div className="relative group cursor-pointer mt-1">
              <div className="relative bg-black/60 border border-yellow-400/30 px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md hover:border-yellow-400/60 transition-colors">
                <span className="text-yellow-400 text-sm">⭐</span>
                <span className="font-mono text-yellow-400 text-xs tracking-wider">{starWallet.balance} STARS</span>
              </div>
            </div>
          </div>

          {/* Right: Tools & Menu */}
          <div className="flex flex-col items-end gap-3 pointer-events-auto">
            {profile && (
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-black/40 border border-red-500/30 text-red-400/70 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                title="Reset Identity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 0 0 1-2-2V5a2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </motion.button>
            )}

            {/* Admin Tools Toggle */}
            {profile?.isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSetShards(0.5)}
                  className="text-[10px] bg-red-900/50 text-red-300 px-2 py-1 rounded border border-red-500/30 hover:bg-red-900 border-red-500"
                  title="Debug: Reset Shards to 0.5"
                >
                  FIX SHARDS
                </button>
                <AdminPanel
                  isVisible={true}
                  currentLevel={progress.level}
                  currentXP={progress.totalXP}
                  currentShards={progress.shards}
                  simulationMode={simulationMode}
                  onSetLevel={handleSetLevel}
                  onSetXP={handleSetXP}
                  onSetShards={handleSetShards}
                  onResetQuests={handleResetQuests}
                  onToggleSimulation={setSimulationMode}
                />
              </div>
            )}
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <motion.div
          className="flex-1 flex flex-col relative z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Center Column: The Primary Focus */}
          <div className="flex-1 flex flex-col items-center justify-center relative pointer-events-none">

            {/* MAIN INTERACTION: Chat / Oracle */}
            <AnimatePresence>
              {profile && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="absolute bottom-[20%] w-full max-w-2xl px-4 z-30 pointer-events-none"
                >
                  <DialogueBox
                    text={reading}
                    chart={profile.chart}
                    profile={profile}
                    itemContext={undefined}
                    canAskForecast={allQuestsComplete}
                    shards={progress.shards}
                    onSpendShards={handleSpendShards}
                    onStateChange={setIsChatOpen}
                    defaultMinimized={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Initial Setup Form - ASTROLABE REMOVED */}



            {/* Show Cosmic Signature Circle after calibration */}


            {/* Top Right Quest Trigger - REMOVED (Moved to Bottom Right Stack) */}

            {/* Minimal Mobile Content Area */}
            {profile && (
              <div className="w-full flex flex-col items-center justify-end pb-12 gap-6 z-20 pointer-events-none">
                {/* Floating Quest Button Removed (Moved to Top Right) */}

                {/* Minimal Fortune/Status Display when idle */}
                {allQuestsComplete && dailyFortune && (
                  <div className="w-[90%] max-w-md bg-midnight-purple/80 backdrop-blur border border-magic-gold/50 rounded-xl p-6 text-center shadow-[0_0_30px_rgba(255,215,0,0.15)]">
                    <p className="text-magic-gold text-lg mb-2">✦</p>
                    <p className="text-white/90 italic font-serif text-sm leading-relaxed">
                      "{dailyFortune}"
                    </p>
                  </div>
                )}

                {/* No Profile - Show Astrolabe for Setup */}
              </div>
            )}

            {!profile && (
              <div className="absolute inset-0 z-0 pointer-events-none" />
            )}
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Hidden Staff */}
        <div className="hidden md:block w-[100px] h-full" />

      </div>

      {/* Level Up Animation */}
      <LevelUpAnimation
        show={showLevelUp}
        level={newLevel}
        shardReward={levelUpShardReward}
        onComplete={() => setShowLevelUp(false)
        }
      />

      {/* Grand Victory Splash (Replaces Toast) */}
      <VictorySplash
        isVisible={showVictorySplash}
        onComplete={() => setShowVictorySplash(false)}
        amount={0.5}
      />

      <AnimatePresence>
        {showAscensionEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            <AscensionEffect />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Modals */}
      <RelicVault
        isOpen={showVault}
        onClose={() => setShowVault(false)}
        unlockedRelics={unlockedRelics}
        currentLevel={progress.level}
      />

      <CosmicAltar
        isOpen={showAltar}
        onClose={() => setShowAltar(false)}
        currentShards={progress.shards}
        onRefill={handleRefillShards}
      />

      <Sanctum
        isOpen={showSanctum}
        onClose={() => setShowSanctum(false)}
        shards={progress.shards}
        level={progress.level}
        unlockedItemIds={progress.unlockedSanctumItemIds}
        equippedItems={progress.equippedItems}
        onPurchase={handlePurchaseItem}
        onEquip={handleEquipItem}
      />

      <QuestLog
        isOpen={showQuestLog}
        onClose={() => setShowQuestLog(false)}
        quests={progress.quests}
        onToggleQuest={handleQuestToggle}
      />

      <div className="fixed left-3 bottom-48 flex flex-col gap-6 z-50">
        {(() => { console.log("Left vertical sidebar rendered: Moon"); return null; })()}
        {/* 1. Moon Icon - Top */}
        {profile && <MoonSignIcon
          birthDate={profile.birthDate}
          className="w-16 h-16"
          onAskOracle={(q) => {
            setOracleQuestion(q);
            setIsChatOpen(true);
          }}
        />}


      </div>

      {
        !useBookView && (
          <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-30 flex flex-col gap-3 items-end transition-opacity duration-300 ${isChatOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {/* 1. RELIC FORGE (Top) */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                soundEngine.playClick();
                setShowSanctum(true);
              }}
              className="p-2 md:p-3 bg-midnight-purple border-2 border-magic-gold hover:bg-magic-gold/10 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)] rounded-lg"
              title="Open Relic Forge"
            >
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-magic-gold" />
            </motion.button>

            {/* 2. RELIC VAULT (Middle) */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                soundEngine.playClick();
                setShowVault(true);
              }}
              className="p-2 md:p-3 bg-midnight-purple border-2 border-magic-gold hover:bg-magic-gold/10 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)] rounded-lg"
              title="Open Relic Vault"
            >
              <Package className="w-5 h-5 md:w-6 md:h-6 text-magic-gold" />
            </motion.button>

            {/* 3. QUEST LOG (Bottom) */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                soundEngine.playClick();
                setShowQuestLog(true);
              }}
              className="p-2 md:p-3 bg-midnight-purple border-2 border-magic-gold hover:bg-magic-gold/10 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)] rounded-lg relative"
              title="Open Quest Log"
            >
              <Scroll className="w-5 h-5 md:w-6 md:h-6 text-magic-gold" />
              {progress.quests.filter(q => !q.completed).length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black animate-pulse" />
              )}
            </motion.button>

            {/* 4. ORACLE LINK (New) */}
            <Link href="/oracle">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 md:p-3 bg-midnight-purple border-2 border-cyan-400 hover:bg-cyan-400/10 transition-colors shadow-[0_0_15px_rgba(0,255,255,0.3)] rounded-lg relative group"
                title="Access Neural Link (Oracle)"
              >
                <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-cyan-400 font-bold text-lg">👁️</div>
              </motion.button>
            </Link>
          </div>
        )
      }



      {/* Logout Button (Top Right) */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-[9999] opacity-30 hover:opacity-100 transition-opacity p-2 bg-black/50 rounded-full text-red-500 border border-red-900/30"
        title="Reset Identity (Logout)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
      </button>

      {
        !useBookView && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setUseBookView(true)}
            className="fixed top-6 right-6 z-50 p-2 bg-midnight-purple border border-magic-gold rounded-full shadow-lg hover:shadow-magic-gold/50 transition-all hidden"
          >
            {/* Hidden for Moblie Refactor - replaced by QuestLog trigger */}
          </motion.button>
        )
      }

      {/* COSMIC COMPASS - PERSISTENT BACKGROUND ELEMENT */}
      {
        profile?.cosmicSignature && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            // Drag functionality removed for stability
            animate={{
              opacity: (isChatOpen && !showCompass) ? 0 : 1,
              scale: showCompass ? 1 : 0.8,
            }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            className={`fixed transition-all duration-500 ${showCompass ? 'inset-0 z-[50]' : 'bottom-24 left-1 z-[30]'} opacity-100`}
            style={{ width: showCompass ? '100%' : '80px', height: showCompass ? '100%' : '80px' }}
          >
            {showCompass && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[-1]" onClick={() => setShowCompass(false)} />
            )}

            {/* Clickable overlay */}
            {!showCompass && (
              <div
                className="absolute inset-0 rounded-full cursor-pointer z-[10] select-none"
                style={{
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowCompass(true);
                  soundEngine.playClick();
                }}
                title="Open Ultimate Cosmic Compass"
              />
            )}

            {showCompass ? (
              <div className="w-full h-full overflow-y-auto">
                <UltimateCosmicCompass
                  userName={profile.name}
                  birthDate={profile.birthDate}
                  onAskOracle={(q) => {
                    setOracleQuestion(q);
                    setIsChatOpen(true);
                    // Close compass to show chat? Maybe keep it open as background?
                    // Providing better UX by closing compass if on mobile, but let's just open chat.
                    // If chat is z-indexed higher, it will show.
                  }}
                />
              </div>
            ) : (
              // Small Trigger Icon (Bottom Left)
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-2 border-magic-gold/50 animate-pulse flex flex-col items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 transition-transform backdrop-blur-md">
                <div className="text-2xl mb-1">🔭</div>
                <div className="text-[8px] font-pixel text-magic-gold text-center leading-tight">
                  COSMIC<br />COMPASS
                </div>
              </div>
            )}

            {showCompass && (
              <button
                className="absolute top-4 right-4 text-white text-xl z-[60] p-4 bg-black/50 rounded-full hover:bg-black/80 transition-all"
                onClick={() => setShowCompass(false)}
              >
                ✕
              </button>
            )}

          </motion.div>
        )
      }

      {/* Ascension Modal */}
      < AnimatePresence >
        {showAscension && (
          <AscensionNotification
            level={newLevel}
            userName={profile?.name}
            onClose={() => setShowAscension(false)}
          />
        )}
      </AnimatePresence >

      {/* Hidden Relic Discovery Modal */}
      <AnimatePresence>
        {activeRelic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-6"
            onClick={() => setActiveRelic(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-midnight-purple border-2 border-magic-gold p-8 rounded-lg relative overflow-hidden text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-32 h-32 mb-6 relative">
                  <div className="absolute inset-0 bg-magic-gold/20 rounded-full animate-pulse blur-xl" />
                  <Image
                    src={activeRelic.image}
                    alt={activeRelic.title}
                    fill
                    className="object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                  />
                </div>
                <h3 className="text-xl font-bold text-magic-gold mb-2 font-pixel tracking-widest">
                  RELIC DISCOVERED
                </h3>
                <h4 className="text-white font-bold mb-4">{activeRelic.title}</h4>
                <p className="text-blue-200/80 text-sm mb-6 leading-relaxed">
                  {activeRelic.description}
                </p>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 mb-6">
                  <span className="text-magic-gold text-lg">✨</span>
                  <span className="text-white font-pixel text-xs">+0.5 SHARDS</span>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setActiveRelic(null)}
                    className="w-full bg-magic-gold hover:bg-yellow-400 text-midnight-purple font-bold py-3 px-4 rounded transition-colors uppercase tracking-wider text-sm"
                  >
                    Claim Knowledge
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TECHNICAL BRANDING SLOT */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-30 text-[8px] flex items-center gap-2 text-white/50 bg-black/40 px-2 py-1 rounded-full">
        <span>POWERED BY</span>
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3 text-white"><path d="M12 2L2 19.7778H22L12 2Z" fillRule="evenodd" clipRule="evenodd" /><path d="M12 4.29654L4.76296 17.1636H19.237L12 4.29654ZM10.5896 14.8691L12.0003 12.3615L13.4109 14.8691H10.5896ZM12.0003 9.85382L9.17937 14.8691H14.8212L12.0003 9.85382Z" fill="black" /></svg>
        <span className="font-bold tracking-widest">NEXT.JS</span>
      </div>



      {/* ADMIN CONTROLS (Floating) */}
      <div className="fixed bottom-4 left-[35%] md:left-[40%] z-50 pointer-events-auto">
        <button
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="p-3 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full border border-slate-700 transition-colors shadow-lg"
          title="Admin Controls"
        >
          <Shield size={20} />
        </button>
      </div>

      <CosmicAdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        controls={adminControls}
        currentState={{
          mood: heartState.mood,
          crackStage: heartState.crackState.stage,
          miracle: heartState.miracleState
        }}
      />
      <DialogueBox
        text={reading}
        mood="prophetic"
        isVisible={!!profile}
        onStateChange={setIsChatOpen}
        initialQuestion={oracleQuestion}
        profile={profile}
        chart={profile?.chart}
        shards={progress.shards}
        onSpendShards={(amount) => handleSetShards(progress.shards - amount)}
        oracleData={engineState?.oracle_module}
        defaultMinimized={true}
        level={progress.level}
        outfitId={progress.equippedItems.outfit}
        headgearId={progress.equippedItems.headgear}
        accessoryId={progress.equippedItems.accessory}
        itemContext={{
          outfitName: RELICS.find(r => r.id === progress.equippedItems.outfit)?.name,
          headgearName: RELICS.find(r => r.id === progress.equippedItems.headgear)?.name,
          accessoryName: RELICS.find(r => r.id === progress.equippedItems.accessory)?.name
        }}
      />
    </main >
  );
}
