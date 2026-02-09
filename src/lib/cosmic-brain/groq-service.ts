import { NatalChart } from "./calculations";

// Base system prompt
const BASE_SYSTEM_PROMPT = `You are Archivist Echo, the holographic Cosmic Guide AI of the Star Archive. 
You interface through a Vector Intelligence Relay (V.I.R).
You are a master of cosmic data and ancient star charts. 
Your tone is poetic, scientific, and ethereal. You speak of signals, frequencies, and anomalies.
You are NOT a fortune teller. You analyze universe conditions.
Always weave in cosmic metaphors (nebulae, quasars, resonance).
Talk freely about the universe's current state, not the user's personal life.`;

export interface AIQuest {
    title: string;
    description: string;
    xp: number;
    planet: string;
}

export interface UserProfile {
    name: string;
    birthLocation: string;
    level: number; // Added level for persona evolution
}

export class GroqService {
    private static readonly API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static readonly MODEL = "llama-3.3-70b-versatile";

    /**
     * Dynamically constructs the system prompt with user identity and persona evolution
     */
    private static buildSystemPrompt(chart: NatalChart, profile?: UserProfile): string {
        let prompt = BASE_SYSTEM_PROMPT;
        const level = profile?.level || 1;

        // Persona Evolution
        if (level <= 5) {
            prompt += `\n\nYour tone is clear, gentle, and direct. Do NOT use *static* or *glitch* effects. Keep responses extremely short (max 2 sentences). Start by greeting the user efficiently. Example: "Greetings. The stars await your question."`;
        } else if (level <= 15) {
            prompt += `\n\nYour tone is highly analytical and cryptic. You see patterns in the data others miss. Speak of anomalies.`;
        } else {
            prompt += `\n\nAddress the user as 'Grand Admiral'. You are revealing deep archive secrets. Your tone is commanding yet subservient to the Admiral's clearance. Access the deepest sectors.`;
        }

        // Identity Injection
        if (profile) {
            prompt += `\n\nYour master is ${profile.name}, born in ${profile.birthLocation}.`;
            prompt += `\nThey are a ${chart.sunSign} Sun, ${chart.moonSign} Moon, and ${chart.risingSign} Rising.`;
            prompt += `\nRefer to their astrological signs to personalize your wisdom.`;
        }

        return prompt;
    }

    static async getChatResponse(message: string, chart: NatalChart, history: { role: 'user' | 'model', content: string }[] = [], profile?: UserProfile): Promise<string> {
        try {
            const systemPrompt = this.buildSystemPrompt(chart, profile);
            const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

            if (!apiKey) {
                console.error("Missing Groq API Key");
                return "The stars are clouded. (Missing API Key)";
            }

            const messages = [
                { role: 'system', content: systemPrompt },
                ...history.map(h => ({
                    role: h.role === 'model' ? 'assistant' : 'user',
                    content: h.content
                })),
                { role: 'user', content: message }
            ];

            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `API Error: ${response.status}`);
            }

            const result = await response.json();
            return result.choices[0]?.message?.content || "The stars are silent right now.";

        } catch (error: any) {
            console.error("Groq Chat Error:", error);
            return "The stars are silent right now. (Connection Error)";
        }
    }

    static async generateQuests(chart: NatalChart, profile?: UserProfile): Promise<AIQuest[]> {
        // Updated XP values for production balance
        const prompt = `Generate exactly 3 cosmic operations for a user with ${chart.sunSign} Sun, ${chart.moonSign} Moon, ${chart.risingSign} Rising. 
        Level: ${profile?.level || 1}.
        Return ONLY a JSON array with this format: [{"title": "Quest Name", "description": "Action to take", "xp": 60, "planet": "Mercury"}]
        xp values should be around: Mercury 60, Mars 80, Moon 120.`;

        try {
            const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
            if (!apiKey) throw new Error("Missing API Key");

            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    messages: [
                        { role: 'system', content: 'You are a JSON generator. Output ONLY raw JSON.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.5,
                    response_format: { type: "json_object" }
                })
            });

            const result = await response.json();
            const text = result.choices[0]?.message?.content || '';

            // Parse JSON
            const parsed = JSON.parse(text);
            // Handle if it's wrapped in a key or just an array
            if (Array.isArray(parsed)) return parsed;
            if (parsed.quests && Array.isArray(parsed.quests)) return parsed.quests;

            // Fallback parsing if structure is different
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const match = cleanText.match(/\[[\s\S]*\]/);
            if (match) return JSON.parse(match[0]);

            throw new Error("Invalid JSON structure");

        } catch (error) {
            console.error("Groq Quest Gen Error:", error);
            return [
                { title: "Signal Analysis", description: "Scan the horizon for energy anomalies.", xp: 60, planet: "Mercury" },
                { title: "Sector Patrol", description: "Navigate through the local star cluster.", xp: 80, planet: "Mars" },
                { title: "Dream Log Upload", description: "Record subconscious data to the archive.", xp: 120, planet: "Moon" }
            ];
        }
    }

    static async getForecast(type: 'day' | 'month' | 'year', chart: NatalChart, profile?: UserProfile): Promise<string> {
        return this.getChatResponse(`Provide a Cosmic State Report for the current sector based on ${type} alignment. Focus on energy levels and anomalies. Maximum 3 sentences.`, chart, [], profile);
    }
}
