import { NatalChart } from "./calculations";
import { GeminiService, UserProfile } from "./gemini-service";

export interface Quest {
    id: string;
    title: string;
    description: string;
    xp: number;
    completed: boolean;
    planet: string;
    voidLore?: string;
}

// EXPANDED FALLBACK TEMPLATES (50+ Variations)
const QUEST_TEMPLATES = {
    Mercury: [
        { title: "Mercury: Send a Message", description: "Reach out to someone you haven't spoken to in a while", xp: 60 },
        { title: "Mercury: Learn Something New", description: "Read an article or watch a tutorial", xp: 60 },
        { title: "Mercury: Write Your Thoughts", description: "Journal for 10 minutes", xp: 60 },
        { title: "Mercury: Clean Digital Space", description: "Organize your desktop or delete old emails", xp: 60 },
        { title: "Mercury: Quick Read", description: "Read 5 pages of a book", xp: 60 },
        { title: "Mercury: Voice Note", description: "Send a voice message to a friend", xp: 60 },
    ],
    Venus: [
        { title: "Venus: Admire Art", description: "Spend time appreciating beauty or creativity", xp: 120 },
        { title: "Venus: Practice Self-Care", description: "Do something kind for yourself", xp: 120 },
        { title: "Venus: Express Gratitude", description: "Thank someone or write down 3 things you're grateful for", xp: 120 },
        { title: "Venus: Wear Your Color", description: "Wear something that makes you feel confident", xp: 120 },
        { title: "Venus: Sweet Treat", description: "Savor a piece of fruit or chocolate mindfully", xp: 120 },
        { title: "Venus: Nature Walk", description: "Find a flower or beautiful tree", xp: 120 },
    ],
    Mars: [
        { title: "Mars: 10m Workout", description: "Get your body moving with exercise", xp: 80 },
        { title: "Mars: Take Action", description: "Complete a task you've been putting off", xp: 80 },
        { title: "Mars: Challenge Yourself", description: "Do something outside your comfort zone", xp: 80 },
        { title: "Mars: Power Stance", description: "Hold a confident pose for 2 minutes", xp: 80 },
        { title: "Mars: Declutter", description: "Throw away 5 things you don't need", xp: 80 },
        { title: "Mars: Cold Shower", description: "End your shower with 30s of cold water", xp: 80 },
    ],
    Jupiter: [
        { title: "Jupiter: Expand Your Mind", description: "Explore a new perspective or philosophy", xp: 140 },
        { title: "Jupiter: Be Generous", description: "Help someone or donate to a cause", xp: 140 },
        { title: "Jupiter: Plan an Adventure", description: "Research a place you'd like to visit", xp: 140 },
        { title: "Jupiter: Big Picture", description: "Visualize your life 5 years from now", xp: 140 },
        { title: "Jupiter: Share Wisdom", description: "Share a quote or insight with others", xp: 140 },
        { title: "Jupiter: Optimism", description: "Find the silver lining in a recent problem", xp: 140 },
    ],
    Saturn: [
        { title: "Saturn: Build Structure", description: "Organize your space or create a schedule", xp: 100 },
        { title: "Saturn: Practice Discipline", description: "Stick to a commitment you made", xp: 100 },
        { title: "Saturn: Review Progress", description: "Reflect on your long-term goals", xp: 100 },
        { title: "Saturn: Digital Detox", description: "No phone for 1 hour", xp: 100 },
        { title: "Saturn: Budget Check", description: "Review your finances for 5 minutes", xp: 100 },
        { title: "Saturn: Clean Workspace", description: "Tidy your desk completely", xp: 100 },
    ],
    // Level 5+ Ancient Galaxy Content
    Neptune: [
        { title: "Neptune: Decode Star Signal", description: "Listen to the frequency of the cosmos for 5 mins", xp: 150 },
        { title: "Neptune: Dream Journal", description: "Record your dreams upon waking", xp: 150 },
        { title: "Neptune: Water Gazing", description: "Meditate while looking at water", xp: 150 },
        { title: "Neptune: Music Immersion", description: "Listen to a song with your eyes closed", xp: 150 },
        { title: "Neptune: Creative Flow", description: "Draw or paint for 10 minutes", xp: 150 },
    ],
    Uranus: [
        { title: "Uranus: Align Chakras", description: "Visualize the energy of the 7 stars flowing through you", xp: 150 },
        { title: "Uranus: Innovate", description: "Solve a problem in a completely new way", xp: 150 },
        { title: "Uranus: Break Routine", description: "Do something completely unexpected today", xp: 150 },
        { title: "Uranus: Tech Cleanse", description: "Update your devices or change a password", xp: 150 },
        { title: "Uranus: Sudden Insight", description: "Write down a random idea immediately", xp: 150 },
    ],
    Pluto: [
        { title: "Pluto: Stardust Harvest", description: "Complete a creative act to generate new matter", xp: 150 },
        { title: "Pluto: Shadow Work", description: "Confront a fear or hidden emotion", xp: 150 },
        { title: "Pluto: Transform", description: "Let go of an old habit", xp: 150 },
        { title: "Pluto: Deep Clean", description: "Clean a hidden corner of your room", xp: 150 },
        { title: "Pluto: Secret", description: "Write a secret on paper and destroy it", xp: 150 },
    ],
    Moon: [
        { title: "Moon: Reflection", description: "Reflect on your emotions today", xp: 70 },
        { title: "Moon: Hydration", description: "Drink a glass of water with intention", xp: 70 },
        { title: "Moon: Comfort", description: "Make your bed or space cozy", xp: 70 },
        { title: "Moon: Intuition", description: "Trust your gut on a small decision", xp: 70 },
    ]
};

export async function generateDailyQuests(chart: NatalChart, date: Date, profile?: UserProfile): Promise<Quest[]> {
    try {
        console.log("Attempting AI Quest Generation...");

        // Use GeminiService (which now has user Profile context)
        // Ensure profile is passed!
        const aiQuests = await GeminiService.generateQuests(chart, profile); // Changed from GroqService

        if (aiQuests && aiQuests.length >= 3) {
            console.log("AI Quests Generated Successfully");
            return aiQuests.map((q, index) => ({
                id: `${date.toISOString().split('T')[0]}-${index}`,
                title: q.title,
                description: q.description,
                xp: q.xp,
                completed: false,
                planet: q.planet || "Moon"
            }));
        } else {
            throw new Error("Insufficient AI quests generated");
        }
    } catch (error) {
        console.error("Falling back to templates:", error);

        // Fallback logic using templates if AI fails
        const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
        const planets = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Moon'];

        // Unlock Outer Planets
        if (profile && profile.level && profile.level >= 5) {
            planets.push('Neptune', 'Uranus', 'Pluto');
        }

        const sunPlanet = getSunPlanet(chart.sunSign);
        const selectedPlanets = [sunPlanet];
        const remainingPlanets = planets.filter(p => p !== sunPlanet);

        // Add random variation to planet selection based on date
        selectedPlanets.push(remainingPlanets[dayOfYear % remainingPlanets.length]);
        selectedPlanets.push(remainingPlanets[(dayOfYear + 2) % remainingPlanets.length]); // Offset to vary

        return selectedPlanets.slice(0, 3).map((planet, index) => {
            const templates = QUEST_TEMPLATES[planet as keyof typeof QUEST_TEMPLATES] || QUEST_TEMPLATES['Moon'];
            const templateIndex = (dayOfYear + index) % templates.length;
            const template = templates[templateIndex];

            return {
                id: `${date.toISOString().split('T')[0]}-${index}`,
                ...template,
                completed: false,
                planet,
            };
        });
    }
}

function getSunPlanet(sunSign: string): string {
    // Map zodiac signs to their ruling planets
    const rulingPlanets: Record<string, string> = {
        'Aries': 'Mars',
        'Taurus': 'Venus',
        'Gemini': 'Mercury',
        'Cancer': 'Jupiter', // Moon -> Jupiter for quest variety
        'Leo': 'Jupiter', // Sun -> Jupiter
        'Virgo': 'Mercury',
        'Libra': 'Venus',
        'Scorpio': 'Mars',
        'Sagittarius': 'Jupiter',
        'Capricorn': 'Saturn',
        'Aquarius': 'Saturn',
        'Pisces': 'Jupiter',
    };

    return rulingPlanets[sunSign] || 'Mercury';
}

export function getDailyFortune(chart: NatalChart): string {
    const fortunes = [
        `The cosmos smiles upon you, ${chart.sunSign}. Today brings opportunities for growth.`,
        `Your ${chart.moonSign} Moon guides you toward emotional clarity. Trust your intuition.`,
        `With ${chart.risingSign} rising, you project confidence. Others will be drawn to your energy.`,
        `The stars align in your favor. A breakthrough awaits in an unexpected area.`,
        `Your journey continues, Traveler. The universe rewards those who persist.`,
    ];

    // Use chart data to select fortune
    const index = (chart.sunDegree + chart.moonDegree + chart.risingDegree) % fortunes.length;
    return fortunes[Math.floor(index)];
}
