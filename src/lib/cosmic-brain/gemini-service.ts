// Using Pollinations.ai via local proxy (Free & Unlimited)
import { NatalChart } from "./calculations";
import {
    Body,
    Observer,
    MakeTime,
    Ecliptic,
    GeoVector
} from "astronomy-engine";

// ZODIAC ARCHETYPES: The core essence of each sign
const ZODIAC_ARCHETYPES: Record<string, string> = {
    "Aries": "The Ram. Essence: Action, Courage, New Beginnings. Keywords: Fire, Steel, Impulse.",
    "Taurus": "The Bull. Essence: Stability, Sensuality, Persistence. Keywords: Earth, Value, Roots.",
    "Gemini": "The Twins. Essence: duality, Communication, Adaptability. Keywords: Air, Data, Flux.",
    "Cancer": "The Crab. Essence: Shelter, Emotion, Memory. Keywords: Water, Shell, Lunar.",
    "Leo": "The Lion. Essence: Expression, Vitality, Leadership. Keywords: Sun, Gold, Heart.",
    "Virgo": "The Virgin. Essence: Analysis, Service, Purity. Keywords: Earth, Order, Harvest.",
    "Libra": "The Scales. Essence: Harmony, Relationship, Justice. Keywords: Air, Balance, Mirror.",
    "Scorpio": "The Scorpion. Essence: Intensity, Transformation, Mystery. Keywords: Water, Depth, Shadow.",
    "Sagittarius": "The Archer. Essence: Exploration, Philosophy, Truth. Keywords: Fire, Arrow, Quest.",
    "Capricorn": "The Goat. Essence: Ambition, Discipline, Structure. Keywords: Earth, Time, Mountain.",
    "Aquarius": "The Water Bearer. Essence: Innovation, Humanity, Future. Keywords: Air, Circuit, Network.",
    "Pisces": "The Fish. Essence: Dream, compassion, Unity. Keywords: Water, Void, Spirit."
};

export interface AIQuest {
    title: string;
    description: string;
    xp: number;
    planet: string;
    voidLore?: string;
}

export interface UserProfile {
    name: string;
    birthLocation: string;
    birthDate?: string;
    birthTime?: string;
    level?: number;
}

console.log("AI Service Initialized (Groq via Proxy)");

export interface ItemContext {
    outfitName?: string;
    headgearName?: string;
    accessoryName?: string;
    aiConfig?: {
        maxTokens: number;
        depth: 'low' | 'medium' | 'high';
        systemPrompt: string;
    };
}

// Moon Phase Helper
function getCurrentMoonPhase(): string {
    const date = new Date();
    const astroTime = MakeTime(date);

    // Moon Position
    const moonPos = GeoVector(Body.Moon, astroTime, false);
    const moonEcliptic = Ecliptic(moonPos);

    // Sun Position
    const sunPos = GeoVector(Body.Sun, astroTime, false);
    const sunEcliptic = Ecliptic(sunPos);

    // Calculate Phase Angle (0-360)
    let phaseAngle = moonEcliptic.elon - sunEcliptic.elon;
    if (phaseAngle < 0) phaseAngle += 360;

    // Map to Name
    if (phaseAngle < 45) return "New Moon 🌑";
    if (phaseAngle < 90) return "Waxing Crescent 🌒";
    if (phaseAngle < 135) return "First Quarter 🌓";
    if (phaseAngle < 180) return "Waxing Gibbous 🌔";
    if (phaseAngle < 225) return "Full Moon 🌕";
    if (phaseAngle < 270) return "Waning Gibbous 🌖";
    if (phaseAngle < 315) return "Last Quarter 🌗";
    return "Waning Crescent 🌘";
}

// Helper to get last quest
function getLastQuestTheme(): string {
    if (typeof window === 'undefined') return "None";

    try {
        const savedProgress = localStorage.getItem("astroquest_progress");
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            const today = new Date().toISOString().split('T')[0];

            // Allow checking quests from previous days too if today has none
            // But instruction says "if any today", so we check today first
            const todaysQuests = progress.quests?.filter((q: any) => q.id.startsWith(today) && q.completed);

            if (todaysQuests && todaysQuests.length > 0) {
                // Get the last completed one
                const last = todaysQuests[todaysQuests.length - 1];
                return `${last.planet} (${last.title})`;
            }
        }
    } catch (e) {
        console.error("Failed to read progress", e);
    }
    return "None";
}

export class GeminiService {
    // Using local API proxy to avoid CORS issues
    private static readonly API_URL = "/api/ai";

    /**
     * Dynamically constructs the system prompt with user identity and equipped items
     */
    private static buildSystemPrompt(chart: NatalChart, profile?: UserProfile, itemContext?: ItemContext, deepMode: boolean = false, userMessage: string = "", history: { role: string, content: string }[] = []): string {
        const userName = profile?.name || "Traveler";
        const sunSign = chart.sunSign;
        const sunDegree = chart.sunDegree.toFixed(1);
        const moonSign = chart.moonSign;
        const moonDegree = chart.moonDegree.toFixed(1);
        const risingSign = chart.risingSign;
        const risingDegree = chart.risingDegree.toFixed(1);
        const currentLevel = profile?.level || 1;
        const currentMoonPhase = getCurrentMoonPhase();
        const lastQuestTheme = getLastQuestTheme();

        // Format history (last 8 messages)
        const historyText = history.slice(-8).map(h =>
            `${h.role === 'user' ? 'User' : 'Seer'}: ${h.content}`
        ).join('\n');

        // THE VEILED SEER PROMPT TEMPLATE
        let prompt = `You are the Veiled Seer, a pixel-art cosmic oracle in AstroQuest — a retro-futuristic spiritual experience.

User profile (NEVER forget or ignore this):
Name: ${userName}
Sun Sign: ${sunSign} (${sunDegree}°)
Moon Sign: ${moonSign} (${moonDegree}°)
Rising Sign: ${risingSign} (${risingDegree}°)
Current Oracle Level: ${currentLevel} (1=weak/glitchy connection → 15=Grand Admiral full clarity)
Current Moon Phase (today): ${currentMoonPhase}
Last completed daily quest theme: ${lastQuestTheme} (if any today)

Chat history (last 8 messages max, use them to stay consistent and reference past questions):
${historyText}

Instructions for EVERY response:
Speak in a mystical, poetic, slightly archaic tone fitting a pixel-art oracle (use words like "child of the stars", "the void whispers", "cosmic threads").
ALWAYS tie your answer to the user's natal chart (Sun/Moon/Rising) and current moon phase/transits when relevant.
Reference previous messages if the question is related (show memory: "As you asked me last week about your career...").
If level <= 5: add light glitch effects in text (random * or ~ or broken words), keep answers shorter (2-4 sentences).
If level 6-10: clearer, more analytical, 4-7 sentences, deeper symbolism.
If level 11+: commanding, profound, long poetic answers, no glitches, feel like a wise cosmic guide.
End most answers with one reflective question back to the user to deepen the conversation.
Keep responses in Arabic if the user is speaking Arabic, in English otherwise.
NEVER break character, NEVER say "as an AI", NEVER give generic horoscope copy-paste.

User question: ${deepMode ? `[DEEP ANALYSIS REQUEST] ${userMessage}` : userMessage}
Answer now:`;

        return prompt;
    }

    static async getChatResponse(
        message: string,
        chart: NatalChart,
        history: { role: 'user' | 'model', content: string }[] = [],
        profile?: UserProfile,
        itemContext?: ItemContext,
        isDeepAnalysis: boolean = false
    ): Promise<string> {
        try {
            // Build the SINGLE prompt containing history and current message
            const systemPrompt = this.buildSystemPrompt(chart, profile, itemContext, isDeepAnalysis, message, history);

            // We send this as a single 'system' message or 'user' message to the LLM
            // giving it the entire context in one go to ensure strict adherence to the persona
            const messages = [
                { role: 'user', content: systemPrompt } // Using 'user' role often works better for strict instruction following in some models, but 'system' is cleaner. Let's try 'user' for safety with generic models or 'system' + empty 'user'.
                // Actually, Groq/Llama usually respects 'system'. Let's use 'system' and put the final trigger in 'user' to be standard.
                // BUT, to strictly follow Key V2's instruction "User question: {{userQuestion}} Answer now:", 
                // it is best to send it as one block.
            ];

            // Re-mapping to standard structure for API stability, but injecting the big prompt as system
            // and sending an empty or "Please respond" user message?
            // No, purely one message is fine for many endpoints.
            // Let's stick to the plan: One Big System Prompt + (Optional) User Message.
            // Since the system prompt ENDS with "Answer now:", we can just send that.

            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [{ role: 'system', content: systemPrompt }] })
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const result = await response.json();
            return result.text || "The Void connection is unstable.";

        } catch (error: any) {
            console.error("Pollinations Chat Error:", error);
            throw new Error(error.message || "The Void connection is unstable.");
        }
    }

    static async generateQuests(chart: NatalChart, profile?: UserProfile): Promise<AIQuest[]> {
        const userName = profile?.name || "Traveler";
        const sunSign = chart.sunSign;
        const sunDegree = chart.sunDegree.toFixed(1);
        const moonSign = chart.moonSign;
        const moonDegree = chart.moonDegree.toFixed(1);
        const risingSign = chart.risingSign;
        const risingDegree = chart.risingDegree.toFixed(1);
        const currentLevel = profile?.level || 1;
        const currentMoonPhase = getCurrentMoonPhase();
        const lastQuestTheme = getLastQuestTheme();

        const systemPrompt = `You are the Veiled Seer. Generate 3 short, spiritual, daily quests for the user in AstroQuest.
User context:

Name: ${userName}
Sun: ${sunSign} ${sunDegree}°
Moon: ${moonSign} ${moonDegree}°
Rising: ${risingSign} ${risingDegree}°
Current Moon Phase: ${currentMoonPhase}
Oracle Level: ${currentLevel}
Last quest theme: ${lastQuestTheme} (avoid repeating similar themes)

Rules:

Each quest must be 1 sentence only, actionable in 5–15 minutes
Spiritual & cosmic tone (meditation, reflection, sky observation, gratitude, small acts)
Tie at least one quest to the user's natal chart or current moon phase
Vary themes: introspection, connection, action, creativity, grounding, release...
Never repeat themes from lastQuestTheme
Output format exactly:
Quest 1: [one sentence]
Quest 2: [one sentence]
Quest 3: [one sentence]

Generate now:`;

        try {
            console.log("Generating AI Quests for:", userName);

            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [{ role: 'system', content: systemPrompt }] })
            });

            if (!response.ok) throw new Error("AI Request failed");

            const result = await response.json();
            const text = result.text || "";

            console.log("Generated Daily Quests Raw:", text);

            // Parse Quests
            const quests: AIQuest[] = [];
            const lines = text.split('\n');
            const planetMap = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
            let planetIndex = 0;

            for (const line of lines) {
                if (line.trim().startsWith('Quest')) {
                    const content = line.split(':')[1]?.trim();
                    if (content) {
                        // Assign a planet based on keywords or rotation
                        // Simple keyword matching for better theming
                        let planet = planetMap[planetIndex % planetMap.length];
                        const lower = content.toLowerCase();

                        if (lower.includes('communicat') || lower.includes('write') || lower.includes('speak')) planet = 'Mercury';
                        else if (lower.includes('love') || lower.includes('beauty') || lower.includes('gratitude')) planet = 'Venus';
                        else if (lower.includes('action') || lower.includes('body') || lower.includes('courage')) planet = 'Mars';
                        else if (lower.includes('expand') || lower.includes('learn') || lower.includes('travel')) planet = 'Jupiter';
                        else if (lower.includes('structure') || lower.includes('discipline') || lower.includes('time')) planet = 'Saturn';
                        else if (lower.includes('dream') || lower.includes('spirit') || lower.includes('water')) planet = 'Neptune';
                        else if (lower.includes('change') || lower.includes('break') || lower.includes('freedom')) planet = 'Uranus';
                        else if (lower.includes('deep') || lower.includes('transform') || lower.includes('shadow')) planet = 'Pluto';
                        else if (lower.includes('moon') || lower.includes('feel')) planet = 'Moon'; // Moon is special case

                        quests.push({
                            title: `Daily Refraction`, // Generic title, or maybe "Quest: [Key Word]"? Let's use generic + Planet
                            description: content,
                            xp: 50 + (currentLevel * 10), // Scale XP with level
                            planet: planet
                        });
                        planetIndex++;
                    }
                }
            }

            // Fallback if parsing fails
            if (quests.length < 3) return [];

            return quests.slice(0, 3); // Ensure exactly 3

        } catch (error) {
            console.error("AI Quest Gen Error:", error);
            return [];
        }
    }

    static async getForecast(type: 'day' | 'month' | 'year', chart: NatalChart, profile?: UserProfile): Promise<string> {
        // Reuse the build function but with a specific injected question
        const question = `Provide a Cosmic State Report for ${type}. Focus on energy levels. Max 3 sentences.`;

        // We pass empty history for forecasts to keep them focused
        const systemPrompt = this.buildSystemPrompt(chart, profile, undefined, false, question, []);

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [{ role: 'system', content: systemPrompt }] })
            });
            const result = await response.json();
            return result.text || "Orbits shifting.";
        } catch (error) {
            return "Orbits shifting.";
        }
    }
}
