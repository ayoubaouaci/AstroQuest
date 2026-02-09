'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './ZodiacCeremony.css';

// بيانات الأبراج
const zodiacDatabase = {
    aries: {
        name: "Aries",
        dates: "Mar 21 - Apr 19",
        element: "Fire",
        planet: "Mars",
        skill: "Warrior's Charge",
        effect: "Deal 25% more damage on first attack each battle",
        description: "Bold and courageous, you lead the charge",
        color: "#FF6B6B",
        image: "/Aries.png"
    },
    taurus: {
        name: "Taurus",
        dates: "Apr 20 - May 20",
        element: "Earth",
        planet: "Venus",
        skill: "Earth's Resilience",
        effect: "Take 30% less damage when not moving",
        description: "Steady and reliable, you stand firm",
        color: "#4ECDC4",
        image: "/Taurus.png"
    },
    gemini: {
        name: "Gemini",
        dates: "May 21 - Jun 20",
        element: "Air",
        planet: "Mercury",
        skill: "Twin Communication",
        effect: "Bypass dialogue obstacles 30% faster",
        description: "Curious and communicative, you connect worlds",
        color: "#FFD166",
        image: "/Gemini.png"
    },
    cancer: {
        name: "Cancer",
        dates: "Jun 21 - Jul 22",
        element: "Water",
        planet: "Moon",
        skill: "Lunar Intuition",
        effect: "Sense hidden paths and secrets",
        description: "Intuitive and protective, you feel deeply",
        color: "#118AB2",
        image: "/Cancer.png"
    },
    leo: {
        name: "Leo",
        dates: "Jul 23 - Aug 22",
        element: "Fire",
        planet: "Sun",
        skill: "Solar Leadership",
        effect: "Boost team attack by 20%",
        description: "Charismatic and confident, you shine bright",
        color: "#EF476F",
        image: "/Leo.png"
    },
    virgo: {
        name: "Virgo",
        dates: "Aug 23 - Sep 22",
        element: "Earth",
        planet: "Mercury",
        skill: "Analytical Precision",
        effect: "Find extra resources in exploration",
        description: "Detail-oriented and helpful, you perfect everything",
        color: "#06D6A0",
        image: "/Virgo.png"
    },
    libra: {
        name: "Libra",
        dates: "Sep 23 - Oct 22",
        element: "Air",
        planet: "Venus",
        skill: "Balanced Judgment",
        effect: "Choose optimal dialogue options automatically",
        description: "Diplomatic and fair, you balance all things",
        color: "#9D4EDD",
        image: "/Libra.png"
    },
    scorpio: {
        name: "Scorpio",
        dates: "Oct 23 - Nov 21",
        element: "Water",
        planet: "Pluto",
        skill: "Strategic Depth",
        effect: "See enemy weaknesses in combat",
        description: "Passionate and mysterious, you uncover truths",
        color: "#7209B7",
        image: "/Scorpio.png"
    },
    sagittarius: {
        name: "Sagittarius",
        dates: "Nov 22 - Dec 21",
        element: "Fire",
        planet: "Jupiter",
        skill: "Explorer's Luck",
        effect: "Find rare items more frequently",
        description: "Adventurous and philosophical, you seek truth",
        color: "#F3722C",
        image: "/Sagittarius.png"
    },
    capricorn: {
        name: "Capricorn",
        dates: "Dec 22 - Jan 19",
        element: "Earth",
        planet: "Saturn",
        skill: "Mountain Patience",
        effect: "Gain resources over time automatically",
        description: "Ambitious and disciplined, you climb every mountain",
        color: "#577590",
        image: "/Capricorn.png"
    },
    aquarius: {
        name: "Aquarius",
        dates: "Jan 20 - Feb 18",
        element: "Air",
        planet: "Uranus",
        skill: "Innovative Thinking",
        effect: "Solve puzzles with alternative solutions",
        description: "Inventive and humanitarian, you think ahead",
        color: "#43AA8B",
        image: "/Aquarius.png"
    },
    pisces: {
        name: "Pisces",
        dates: "Feb 19 - Mar 20",
        element: "Water",
        planet: "Neptune",
        skill: "Empathic Connection",
        effect: "Understand NPC motivations and gain favor",
        description: "Compassionate and artistic, you feel all emotions",
        color: "#277DA1",
        image: "/Pisces.png"
    }
};

// دالة حساب البرج
const calculateZodiac = (day: number, month: number): string => {
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
    return 'aries';
};

export default function ZodiacCeremony() {
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [selectedZodiac, setSelectedZodiac] = useState<any>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(-1);
    const [cardAnimation, setCardAnimation] = useState<'enter' | 'exit' | 'destiny'>('exit');
    const [showSeer, setShowSeer] = useState(true);
    const [seerAction, setSeerAction] = useState<'idle' | 'pointing' | 'selecting' | 'revealing'>('idle');
    const [dialogue, setDialogue] = useState('');
    const [showDestinyText, setShowDestinyText] = useState(false);
    const [showSkill, setShowSkill] = useState(false);

    const zodiacOrder = [
        'aries', 'taurus', 'gemini', 'cancer',
        'leo', 'virgo', 'libra', 'scorpio',
        'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];

    const sequenceRef = useRef<any>(null);

    useEffect(() => {
        const savedData = localStorage.getItem('astroUserData');

        if (!savedData) {
            router.push('/');
            return;
        }

        try {
            const data = JSON.parse(savedData);
            setUserData(data);

            const zodiacId = calculateZodiac(parseInt(data.day), parseInt(data.month));
            const zodiac = zodiacDatabase[zodiacId as keyof typeof zodiacDatabase];
            setSelectedZodiac(zodiac);

            setTimeout(() => {
                startFastSequence(zodiacId);
            }, 1000);

        } catch (error) {
            router.push('/');
        }

        return () => {
            if (sequenceRef.current) clearTimeout(sequenceRef.current);
        };
    }, [router]);

    // تسلسل سريع
    const startFastSequence = (targetZodiacId: string) => {
        const targetIndex = zodiacOrder.indexOf(targetZodiacId);
        let step = 0;

        const runStep = () => {
            switch (step) {
                case 0:
                    setDialogue("The stars reveal your path...");
                    setSeerAction('idle');
                    step++;
                    sequenceRef.current = setTimeout(runStep, 1800); // أسرع
                    break;

                case 1:
                    setDialogue(`For ${userData?.name}, I seek...`);
                    step++;
                    sequenceRef.current = setTimeout(runStep, 1500); // أسرع
                    break;

                case 2:
                    setDialogue("Searching the zodiac...");
                    setSeerAction('pointing');
                    step++;
                    sequenceRef.current = setTimeout(runStep, 1200); // أسرع
                    break;

                case 3:
                    setSeerAction('selecting');
                    showAllCardsFast(targetIndex);
                    step = 100;
                    break;
            }
        };

        runStep();
    };

    // عرض جميع البطاقات بسرعة
    const showAllCardsFast = async (targetIndex: number) => {
        // المرحلة 1: عرض البطاقات السريعة (غير المستهدفة)
        for (let i = 0; i < zodiacOrder.length; i++) {
            if (i === targetIndex) continue; // تخطي المستهدفة

            setCurrentCardIndex(i);
            setCardAnimation('enter');

            // سريع: ظهر واختفِ
            await delay(800);  // كان 2000 - الآن 800
            setCardAnimation('exit');
            await delay(400);  // كان 1000 - الآن 400
        }

        // المرحلة 2: البطاقة المستهدفة
        setSeerAction('revealing');
        setDialogue("This is the one!");

        await delay(1000);

        setCurrentCardIndex(targetIndex);
        setCardAnimation('enter');

        await delay(1200);

        // إظهار النص فوق البطاقة
        setShowDestinyText(true);
        setCardAnimation('destiny');

        await delay(2000);

        // الانتقال للمهارات
        setShowSkill(true);
    };

    const delay = (ms: number): Promise<void> => {
        return new Promise(resolve => {
            sequenceRef.current = setTimeout(resolve, ms);
        });
    };

    const acceptDestiny = () => {
        if (userData && selectedZodiac) {
            // Find ID based on selected value
            const id = Object.keys(zodiacDatabase).find(key => zodiacDatabase[key as keyof typeof zodiacDatabase] === selectedZodiac);

            if (id) {
                const updatedData = {
                    ...userData,
                    zodiac: id,
                    zodiacName: selectedZodiac.name,
                    skill: selectedZodiac.skill,
                    zodiacSelected: new Date().toISOString()
                };
                localStorage.setItem('astroUserData', JSON.stringify(updatedData));
                router.push('/game');
            }
        }
    };

    if (!userData || !selectedZodiac) {
        return (
            <div className="loading-screen">
                <div className="fast-loader"></div>
                <p>Cosmic connection...</p>
            </div>
        );
    }

    return (
        <div className="seer-ceremony fast">
            {/* خلفية */}
            <div className="fast-bg"></div>

            {/* العرافة */}
            {showSeer && (
                <div className={`seer-character fast ${seerAction}`}>
                    <div className="seer-image">
                        <img
                            src="/seer-stage-1.2.png"
                            alt="The Veiled Seer"
                            className="seer-sprite"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = `
                                    <div class="seer-placeholder">
                                        🔮
                                    </div>
                                `;
                            }}
                        />
                    </div>

                    {/* حوار العرافة */}
                    {dialogue && (
                        <div className="seer-dialogue fast">
                            <h3>THE VEILED SEER</h3>
                            <p>{dialogue}</p>
                        </div>
                    )}
                </div>
            )}

            {/* مسرح البطاقات */}
            <div className="card-stage-fast">
                {currentCardIndex >= 0 && zodiacDatabase[zodiacOrder[currentCardIndex] as keyof typeof zodiacDatabase] && (
                    <div
                        className={`fast-card ${cardAnimation} ${currentCardIndex === zodiacOrder.indexOf(selectedZodiac?.id || '') ? 'destiny' : ''
                            }`}
                    >
                        {/* البطاقة بدون إطار */}
                        <img
                            src={zodiacDatabase[zodiacOrder[currentCardIndex] as keyof typeof zodiacDatabase].image}
                            alt={zodiacOrder[currentCardIndex]}
                            className="card-image-clean"
                        />

                        {/* النص فوق البطاقة المستهدفة فقط */}
                        {zodiacDatabase[zodiacOrder[currentCardIndex] as keyof typeof zodiacDatabase] === selectedZodiac &&
                            showDestinyText && cardAnimation === 'destiny' && (
                                <div className="destiny-text-overlay">
                                    <h2>{selectedZodiac.name.toUpperCase()}</h2>
                                    <p className="destiny-subtitle">YOUR COSMIC DESTINY</p>
                                </div>
                            )}
                    </div>
                )}
            </div>

            {/* شاشة المهارات */}
            {showSkill && selectedZodiac && (
                <div className="skill-reveal-fast">
                    <div className="skill-container-fast">
                        <h2>✨ YOUR DESTINY ✨</h2>

                        <div className="selected-zodiac-fast">
                            <div className="zodiac-image-clean">
                                <img src={selectedZodiac.image} alt={selectedZodiac.name} />
                            </div>
                            <div className="zodiac-info-fast">
                                <h3>{selectedZodiac.name}</h3>
                                <p className="dates">{selectedZodiac.dates}</p>
                                <p className="element">{selectedZodiac.element}</p>
                                <p className="planet">{selectedZodiac.planet}</p>
                            </div>
                        </div>

                        <div className="skill-details-fast">
                            <h4>ACQUIRED SKILL</h4>
                            <div className="skill-card-fast">
                                <h5>{selectedZodiac.skill}</h5>
                                <p>{selectedZodiac.effect}</p>
                            </div>
                        </div>

                        <div className="action-buttons-fast">
                            <button className="accept-button-fast" onClick={acceptDestiny}>
                                ✅ ACCEPT DESTINY
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
