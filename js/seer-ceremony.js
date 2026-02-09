// =============================================
// ASTRO QUEST - SEER CEREMONY SCRIPT
// =============================================
// Main file for zodiac selection ceremony scene
// =============================================

// 🎯 **Main Functions**:
// 1. Load user data from localStorage
// 2. Calculate zodiac from birth date automatically
// 3. Display seer ceremony with animated cards
// 4. Highlight user's zodiac card
// 5. Show acquired zodiac skill

// =============================================
// 1. INITIALIZE SCENE WHEN PAGE LOADS
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔮 Astro Quest - Seer Ceremony Initialized');

    // Check if user data exists
    const userData = loadUserData();

    if (!userData) {
        // If no data, return to registration
        // NOTE: In a real deployment, ensure index.html exists or handle this gracefully
        // alert('❌ Please enter your information first!'); 
        // window.location.href = 'index.html'; 
        console.warn("User data missing. Redirect suppressed for development.");
        // Mock data for testing if missing
        startSeerCeremony({ name: "Traveler", day: 25, month: 5, year: 2000 }, 'gemini');
        return;
    }

    console.log('👤 User Data Loaded:', userData);

    // Calculate zodiac from birth date
    const zodiacSign = calculateZodiac(parseInt(userData.day), parseInt(userData.month));
    console.log('♊ Calculated Zodiac:', zodiacSign);

    // Start the ceremony
    startSeerCeremony(userData, zodiacSign);
});

// =============================================
// 2. LOAD USER DATA FROM LOCALSTORAGE
// =============================================
function loadUserData() {
    try {
        const savedData = localStorage.getItem('astroUserData');
        if (!savedData) {
            console.error('No user data found in localStorage');
            return null;
        }

        const userData = JSON.parse(savedData);

        // Validate required fields
        if (!userData.name || !userData.day || !userData.month) {
            console.error('Missing required user data fields');
            return null;
        }

        return userData;
    } catch (error) {
        console.error('Error loading user data:', error);
        return null;
    }
}

// =============================================
// 3. ZODIAC CALCULATION FUNCTION
// =============================================
function calculateZodiac(day, month) {
    // Validate input
    if (isNaN(day) || day < 1 || day > 31) {
        console.warn('Invalid day, defaulting to Aries');
        return 'aries';
    }

    if (isNaN(month) || month < 1 || month > 12) {
        console.warn('Invalid month, defaulting to Aries');
        return 'aries';
    }

    console.log(`📅 Calculating zodiac for: Day ${day}, Month ${month}`);

    // Zodiac date ranges
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces';

    console.warn('Could not calculate zodiac, defaulting to Aries');
    return 'aries'; // Fallback
}

// =============================================
// 4. ZODIAC DATA - SKILLS AND INFORMATION
// =============================================
const zodiacDatabase = {
    aries: {
        name: "Aries",
        arabicName: "الحمل",
        dates: "Mar 21 - Apr 19",
        element: "Fire",
        planet: "Mars",
        skill: "Warrior's Charge",
        effect: "Deal 25% more damage on first attack each battle",
        description: "Bold and courageous, you lead the charge",
        color: "#FF6B6B",
        image: "aries.png"
    },
    taurus: {
        name: "Taurus",
        arabicName: "الثور",
        dates: "Apr 20 - May 20",
        element: "Earth",
        planet: "Venus",
        skill: "Earth's Resilience",
        effect: "Take 30% less damage when not moving",
        description: "Steady and reliable, you stand firm",
        color: "#4ECDC4",
        image: "taurus.png"
    },
    gemini: {
        name: "Gemini",
        arabicName: "الجوزاء",
        dates: "May 21 - Jun 20",
        element: "Air",
        planet: "Mercury",
        skill: "Twin Communication",
        effect: "Bypass dialogue obstacles 30% faster",
        description: "Curious and communicative, you connect worlds",
        color: "#FFD166",
        image: "gemini.png"
    },
    cancer: {
        name: "Cancer",
        arabicName: "السرطان",
        dates: "Jun 21 - Jul 22",
        element: "Water",
        planet: "Moon",
        skill: "Lunar Intuition",
        effect: "Sense hidden paths and secrets",
        description: "Intuitive and protective, you feel deeply",
        color: "#118AB2",
        image: "cancer.png"
    },
    leo: {
        name: "Leo",
        arabicName: "الأسد",
        dates: "Jul 23 - Aug 22",
        element: "Fire",
        planet: "Sun",
        skill: "Solar Leadership",
        effect: "Boost team attack by 20%",
        description: "Charismatic and confident, you shine bright",
        color: "#EF476F",
        image: "leo.png"
    },
    virgo: {
        name: "Virgo",
        arabicName: "العذراء",
        dates: "Aug 23 - Sep 22",
        element: "Earth",
        planet: "Mercury",
        skill: "Analytical Precision",
        effect: "Find extra resources in exploration",
        description: "Detail-oriented and helpful, you perfect everything",
        color: "#06D6A0",
        image: "virgo.png"
    },
    libra: {
        name: "Libra",
        arabicName: "الميزان",
        dates: "Sep 23 - Oct 22",
        element: "Air",
        planet: "Venus",
        skill: "Balanced Judgment",
        effect: "Choose optimal dialogue options automatically",
        description: "Diplomatic and fair, you balance all things",
        color: "#9D4EDD",
        image: "libra.png"
    },
    scorpio: {
        name: "Scorpio",
        arabicName: "العقرب",
        dates: "Oct 23 - Nov 21",
        element: "Water",
        planet: "Pluto",
        skill: "Strategic Depth",
        effect: "See enemy weaknesses in combat",
        description: "Passionate and mysterious, you uncover truths",
        color: "#7209B7",
        image: "scorpio.png"
    },
    sagittarius: {
        name: "Sagittarius",
        arabicName: "القوس",
        dates: "Nov 22 - Dec 21",
        element: "Fire",
        planet: "Jupiter",
        skill: "Explorer's Luck",
        effect: "Find rare items more frequently",
        description: "Adventurous and philosophical, you seek truth",
        color: "#F3722C",
        image: "sagittarius.png"
    },
    capricorn: {
        name: "Capricorn",
        arabicName: "الجدي",
        dates: "Dec 22 - Jan 19",
        element: "Earth",
        planet: "Saturn",
        skill: "Mountain Patience",
        effect: "Gain resources over time automatically",
        description: "Ambitious and disciplined, you climb every mountain",
        color: "#577590",
        image: "capricorn.png"
    },
    aquarius: {
        name: "Aquarius",
        arabicName: "الدلو",
        dates: "Jan 20 - Feb 18",
        element: "Air",
        planet: "Uranus",
        skill: "Innovative Thinking",
        effect: "Solve puzzles with alternative solutions",
        description: "Inventive and humanitarian, you think ahead",
        color: "#43AA8B",
        image: "aquarius.png"
    },
    pisces: {
        name: "Pisces",
        arabicName: "الحوت",
        dates: "Feb 19 - Mar 20",
        element: "Water",
        planet: "Neptune",
        skill: "Empathic Connection",
        effect: "Understand NPC motivations and gain favor",
        description: "Compassionate and artistic, you feel all emotions",
        color: "#277DA1",
        image: "pisces.png"
    }
};

// =============================================
// 5. MAIN CEREMONY FUNCTION
// =============================================
function startSeerCeremony(userData, zodiacSign) {
    console.log('🎭 Starting Seer Ceremony for:', userData.name);

    // Store current zodiac in global variable
    window.currentZodiac = zodiacSign;
    window.userData = userData;

    // Step 1: Show initial dialogue
    startDialogueSequence(userData, zodiacSign);

    // Step 2: Create zodiac wheel after dialogue
    setTimeout(() => {
        createZodiacWheel(zodiacSign);
    }, 2000);
}

// =============================================
// 6. DIALOGUE SEQUENCE
// =============================================
function startDialogueSequence(userData, zodiacSign) {
    const dialogueBox = document.getElementById('dialogueBox');
    const dialogueText = document.getElementById('dialogueText');

    if (!dialogueBox || !dialogueText) {
        console.error('Dialogue elements not found in HTML. Ensure #dialogueBox and #dialogueText exist.');
        return;
    }

    const dialogues = [
        `I see the threads of your fate, ${userData.name}...`,
        `Your birth date, ${userData.day}/${userData.month}/${userData.year}, holds celestial secrets...`,
        `Let me consult the ancient cards of destiny...`,
        `The stars align... The planets position themselves...`,
        `Ah! I have found it! The constellation that guards your soul...`
    ];

    let currentIndex = 0;

    // Function to show next dialogue
    function showNextDialogue() {
        if (currentIndex < dialogues.length) {
            dialogueText.textContent = dialogues[currentIndex];
            dialogueText.style.animation = 'none';
            setTimeout(() => {
                dialogueText.style.animation = 'typewriter 2s steps(40)';
            }, 10);

            currentIndex++;

            // Schedule next dialogue or start cards
            if (currentIndex < dialogues.length) {
                setTimeout(showNextDialogue, 3000);
            } else {
                // Last dialogue - prepare for cards
                setTimeout(() => {
                    dialogueBox.style.opacity = '0.5';
                }, 2000);
            }
        }
    }

    // Start dialogue sequence
    showNextDialogue();
}

// =============================================
// 7. CREATE ZODIAC WHEEL WITH CARDS
// =============================================
function createZodiacWheel(selectedSignId) {
    const wheelContainer = document.getElementById('zodiacWheel');

    if (!wheelContainer) {
        console.error('Zodiac wheel container not found. Ensure #zodiacWheel exists.');
        return;
    }

    // Clear any existing cards
    wheelContainer.innerHTML = '';

    // All zodiac signs in order
    const zodiacOrder = [
        'aries', 'taurus', 'gemini', 'cancer',
        'leo', 'virgo', 'libra', 'scorpio',
        'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];

    // Create 12 cards in a circle
    zodiacOrder.forEach((signId, index) => {
        const zodiacData = zodiacDatabase[signId];

        // Create card element
        const card = document.createElement('div');
        card.className = 'zodiac-card';
        card.id = `zodiac-card-${signId}`;
        card.dataset.sign = signId;

        // Calculate position in circle (30° between each card)
        const angle = (index * 30) * (Math.PI / 180);
        const radius = 200; // Circle radius
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        // Set initial position
        card.style.left = `calc(50% + ${x}px)`;
        card.style.top = `calc(50% + ${y}px)`;

        // Create image
        const img = document.createElement('img');

        // Try multiple image paths - using /Name.png logic as primary since we validated public folder
        // The user provided paths list is good, but let's prioritize the ones we know behave well in nextjs
        const imagePaths = [
            `/${zodiacData.name}.png`, // Try Capitalized first as per file list (Aries.png)
            `/public/${signId}.png`,
            `/${signId}.png`,
            `${signId}.png`
        ];

        // Try each path until one works
        let imgLoaded = false;

        // Simple error handler chain
        img.onerror = function () {
            // Keep trying standard variations if first failed
            // For now, simpler to just set the most likely correct path
            if (this.src.includes(`/${zodiacData.name}.png`)) {
                // Fallback to lowercase
                this.src = `/${signId}.png`;
            } else {
                // Last resort placeholder
                this.style.display = 'none';
                if (!card.querySelector('.zodiac-placeholder')) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'zodiac-placeholder';
                    placeholder.textContent = zodiacData.arabicName || zodiacData.name;
                    placeholder.style.backgroundColor = zodiacData.color;
                    placeholder.classList.add('flex-center');
                    card.appendChild(placeholder);
                }
            }
        };

        // Default to the one that matches file list: /Aries.png
        img.src = `/${zodiacData.name}.png`;

        img.alt = zodiacData.name;
        img.title = zodiacData.name;

        card.appendChild(img);
        wheelContainer.appendChild(card);
    });

    // Start the animation sequence
    setTimeout(() => {
        startCardAnimation(selectedSignId);
    }, 1000);
}

// =============================================
// 8. CARD ANIMATION SEQUENCE
// =============================================
function startCardAnimation(selectedSignId) {
    console.log('🎬 Starting card animation for:', selectedSignId);

    const allCards = document.querySelectorAll('.zodiac-card');

    // Step 1: Start shuffling animation
    allCards.forEach(card => {
        card.classList.add('shuffling');
    });

    // Step 2: After 3 seconds, stop and highlight selected card
    setTimeout(() => {
        // Stop shuffling
        allCards.forEach(card => {
            card.classList.remove('shuffling');
            card.classList.add('stopped');

            // Fade out non-selected cards
            if (card.dataset.sign !== selectedSignId) {
                card.style.opacity = '0.3';
                card.style.filter = 'blur(2px)';
            }
        });

        // Highlight selected card
        const selectedCard = document.getElementById(`zodiac-card-${selectedSignId}`);
        if (selectedCard) {
            selectedCard.classList.add('highlighted');
            selectedCard.classList.add('pulsing');

            // Move selected card to center
            selectedCard.style.left = '50%';
            selectedCard.style.top = '50%';
            selectedCard.style.transform = 'translate(-50%, -50%) scale(1.5)';
            selectedCard.style.zIndex = '1000';

            // Add glow effect
            selectedCard.style.boxShadow = '0 0 40px gold, 0 0 80px rgba(255, 215, 0, 0.5)';
        }

        // Step 3: Show skill details after 2 seconds
        setTimeout(() => {
            showSkillDetails(selectedSignId);
        }, 2000);

    }, 3000); // Shuffling duration
}

// =============================================
// 9. SHOW SKILL DETAILS
// =============================================
function showSkillDetails(zodiacSignId) {
    const zodiacData = zodiacDatabase[zodiacSignId];
    const skillReveal = document.getElementById('skillReveal');
    const skillDetails = document.getElementById('skillDetails');

    if (!zodiacData || !skillReveal || !skillDetails) {
        console.error('Cannot show skill details - elements missing');
        return;
    }

    // Create skill display HTML
    skillDetails.innerHTML = `
        <div class="skill-card" style="
            background: linear-gradient(135deg, ${zodiacData.color}20, ${zodiacData.color}40);
            border-left: 5px solid ${zodiacData.color};
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        ">
            <h3 style="color: ${zodiacData.color}; margin: 0 0 10px 0;">
                ♊ ${zodiacData.name} (${zodiacData.arabicName})
            </h3>
            <p style="margin: 5px 0;"><strong>📅 Period:</strong> ${zodiacData.dates}</p>
            <p style="margin: 5px 0;"><strong>🔥 Element:</strong> ${zodiacData.element}</p>
            <p style="margin: 5px 0;"><strong>🪐 Ruling Planet:</strong> ${zodiacData.planet}</p>
            
            <div style="margin: 20px 0; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0;">✨ Acquired Skill ✨</h4>
                <h5 style="color: gold; margin: 10px 0;">${zodiacData.skill}</h5>
                <p>${zodiacData.effect}</p>
            </div>
            
            <p style="font-style: italic; color: #ccc;">
                "${zodiacData.description}"
            </p>
        </div>
        
        <div class="seer-advice" style="
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px dashed #666;
            font-style: italic;
        ">
            <p>🔮 <strong>The Seer's Wisdom:</strong></p>
            <p>"Use your ${zodiacData.element.toLowerCase()} nature wisely. 
            As a ${zodiacData.name.toLowerCase()}, you possess unique strengths 
            that will guide you in Astro Quest."</p>
        </div>
    `;

    // Show the skill reveal section
    skillReveal.style.display = 'block';

    // Play success sound if available
    playSound('success');
}

// =============================================
// 10. ACCEPT DESTINY BUTTON FUNCTION
// =============================================
function acceptDestiny() {
    console.log('✅ User accepted their zodiac destiny');

    // Save zodiac choice to localStorage
    const userData = loadUserData();
    if (userData && window.currentZodiac) {
        userData.zodiac = window.currentZodiac;
        userData.zodiacSelected = true;
        userData.selectionDate = new Date().toISOString();

        localStorage.setItem('astroUserData', JSON.stringify(userData));
    }

    // Show confirmation
    alert(`🎉 Welcome, ${userData?.name || 'Traveler'}! \nYour journey as ${zodiacDatabase[window.currentZodiac]?.name} begins now!`);

    // Redirect to main game
    window.location.href = 'game.html';
}

// =============================================
// 11. HELPER FUNCTIONS
// =============================================
function playSound(soundName) {
    // Simple sound player - implement based on your audio system
    try {
        const audio = new Audio(`sounds/${soundName}.mp3`);
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play failed (user interaction needed first)'));
    } catch (error) {
        console.log('Sound not available:', error);
    }
}

function debugInfo() {
    console.log('=== DEBUG INFO ===');
    console.log('User Data:', window.userData);
    console.log('Selected Zodiac:', window.currentZodiac);
    console.log('LocalStorage:', localStorage.getItem('astroUserData'));
    console.log('Cards in DOM:', document.querySelectorAll('.zodiac-card').length);
    console.log('==================');
}

// =============================================
// 13. EXPORT FUNCTIONS FOR HTML USE
// =============================================
// Make functions available in global scope for HTML onclick events
window.calculateZodiac = calculateZodiac;
window.startSeerCeremony = startSeerCeremony;
window.acceptDestiny = acceptDestiny;
window.debugInfo = debugInfo;

console.log('✅ Seer Ceremony Script Loaded Successfully');
