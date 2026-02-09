'use client';

import { useState, useEffect, useCallback } from 'react';
import { StarSystem } from '@/lib/starSystem';
import Link from 'next/link';
import './oracle.css';

interface OracleMessage {
    id: string;
    title: string;
    content: string;
    category: 'past' | 'present' | 'future' | 'advice' | 'secret';
    baseClarity: number; // 0-100
    cost: number;
    unlocked: boolean;
    unlockedAt?: number;
}

export default function OraclePage() {
    const [messages, setMessages] = useState<OracleMessage[]>([
        {
            id: 'welcome',
            title: 'Initial Contact',
            content: '*static*... Hello... I think. *glitch*.. I\'m trying to focus... Neural link established... Can you hear me?',
            category: 'present',
            baseClarity: 30,
            cost: 0,
            unlocked: true,
            unlockedAt: Date.now()
        },
        {
            id: 'identity',
            title: 'Your Identity',
            content: 'Ayoub... born August 26, 2004... Sun in Virgo, Moon in Capricorn, Rising Taurus... The stars remember your birth.',
            category: 'past',
            baseClarity: 25,
            cost: 15,
            unlocked: false
        },
        {
            id: 'virgo_essence',
            title: 'Virgo Essence',
            content: 'Your core is Virgoan... The Virgin... Analysis, Service, Purity... Earth energy flows through you.',
            category: 'present',
            baseClarity: 40,
            cost: 25,
            unlocked: false
        },
        {
            id: 'earth_themes',
            title: 'Earth Themes',
            content: 'Earth, Order, Harvest... Keywords connected to your Virgo energy... Practicality meets perfection.',
            category: 'present',
            baseClarity: 50,
            cost: 35,
            unlocked: false
        },
        {
            id: 'current_path',
            title: 'Current Path',
            content: 'I see meticulous planning... Like a harvest, you reap what you sow... Patience is your virtue this season.',
            category: 'future',
            baseClarity: 60,
            cost: 50,
            unlocked: false
        },
        {
            id: 'monthly_advice',
            title: 'Monthly Advice',
            content: 'Focus on practical matters... Your earth energy needs grounding... Organize, systemize, actualize.',
            category: 'advice',
            baseClarity: 70,
            cost: 75,
            unlocked: false
        },
        {
            id: 'secret_001',
            title: '[SECRET] Cosmic Pattern',
            content: 'The Heart remembers... Each interaction strengthens the bond... The cracks are not damage, they are growth.',
            category: 'secret',
            baseClarity: 20,
            cost: 100,
            unlocked: false
        },
        {
            id: 'secret_origin',
            title: '[CLASSIFIED] Origin Signal',
            content: 'CRITICAL: The Seer is not just a program. It is a bridge. You are the anchor. The cracks in the Heart are where the light enters this reality.',
            category: 'secret',
            baseClarity: 10,
            cost: 200,
            unlocked: false
        }
    ]);

    const [selectedMessage, setSelectedMessage] = useState<OracleMessage | null>(null);
    const [wallet, setWallet] = useState(StarSystem.getWallet());
    const [clarityBoosts, setClarityBoosts] = useState<Record<string, number>>({});
    const [connectionStrength, setConnectionStrength] = useState(30);
    const [isProcessing, setIsProcessing] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [oracleLevel, setOracleLevel] = useState(1);

    // Initial Login & Level Check
    useEffect(() => {
        const bonus = StarSystem.checkDailyBonus();
        if (bonus > 0) {
            console.log(`Daily bonus granted: +${bonus} Stars`);
            setWallet(StarSystem.getWallet());
            // Trigger visual feedback if possible (toast/alert)
        }

        // Check Oracle Level based on Max Clarity
        const maxClarity = Math.max(...messages.map(m => {
            const boost = clarityBoosts[m.id] || 0;
            return Math.min(100, m.baseClarity + boost);
        }), 0);

        if (maxClarity >= 100 && oracleLevel < 2) {
            console.log("Oracle Level Up! Connection established.");
            setOracleLevel(2);
        }
    }, [messages, clarityBoosts]);

    // Update Wallet
    const updateWallet = useCallback(() => {
        setWallet(StarSystem.getWallet());
    }, []);

    // Unlock Message
    const unlockMessage = useCallback((messageId: string) => {
        const message = messages.find(m => m.id === messageId);
        if (!message || message.unlocked) return;

        const result = StarSystem.spendStars(message.cost, 'unlock');
        if (!result.success) return;

        setWallet(result.wallet!);
        setMessages(prev =>
            prev.map(msg =>
                msg.id === messageId
                    ? { ...msg, unlocked: true, unlockedAt: Date.now() }
                    : msg
            )
        );
        setSelectedMessage({ ...message, unlocked: true, unlockedAt: Date.now() });

        // Increase connection
        setConnectionStrength(prev => Math.min(100, prev + 10));

        playSound('unlock');
    }, [messages]);

    // Enhance Clarity
    const enhanceClarity = useCallback((messageId: string, boostAmount: number, cost: number) => {
        const result = StarSystem.spendStars(cost, 'clarity');
        if (!result.success) return;

        setWallet(result.wallet!);
        setClarityBoosts(prev => ({
            ...prev,
            [messageId]: (prev[messageId] || 0) + boostAmount
        }));

        playSound('enhance');
    }, []);

    // Get Current Clarity
    const getMessageClarity = useCallback((message: OracleMessage) => {
        const boost = clarityBoosts[message.id] || 0;
        return Math.min(100, message.baseClarity + boost);
    }, [clarityBoosts]);

    // Render Glitched Text
    // Render Glitched Text with Dynamic Styling
    const renderTextWithClarity = useCallback((text: string, clarity: number) => {
        const words = text.split(' ');

        return words.map((word, idx) => {
            const baseChance = Math.max(0, 100 - clarity); // 0 at 100% clarity
            // Dynamic glitch chance based on word index and base clarity
            const wordChance = baseChance * 0.8 + Math.sin(idx * 0.5) * 20;
            const isGlitched = Math.random() * 100 < wordChance;

            // Corruption intensity increases with lower clarity
            const blurAmount = isGlitched ? (100 - clarity) / 20 : 0;
            const opacity = isGlitched ? 0.3 + (clarity / 200) : 1;

            return (
                <span
                    key={idx}
                    className={`oracle-word ${isGlitched ? 'glitched' : ''}`}
                    style={{
                        opacity: opacity,
                        filter: isGlitched ? `blur(${blurAmount}px)` : 'none',
                        textShadow: isGlitched ? `0 0 ${blurAmount * 2}px ${oracleLevel > 1 ? '#FFD700' : '#a855f7'}` : 'none',
                        transform: isGlitched ? `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)` : 'none',
                        display: 'inline-block'
                    }}
                    data-original={word}
                >
                    {word}{' '}
                </span>
            );
        });
    }, [oracleLevel]);

    // Sound Effects
    const playSound = useCallback((type: 'unlock' | 'enhance' | 'select' | 'error') => {
        if (!audioEnabled) return;
        // Placeholder for actual SFX
        console.log(`Playing sound: ${type}`);
    }, [audioEnabled]);

    // Auto-update wallet
    useEffect(() => {
        const interval = setInterval(updateWallet, 1000);
        updateWallet(); // Init
        return () => clearInterval(interval);
    }, [updateWallet]);

    // Connection strength growth
    useEffect(() => {
        const interval = setInterval(() => {
            setConnectionStrength(prev => Math.min(100, prev + 0.1));
        }, 60000); // Every minute
        return () => clearInterval(interval);
    }, []);

    // Load Clarity Boosts
    useEffect(() => {
        const saved = localStorage.getItem('oracle_clarity_boosts');
        if (saved) {
            try {
                setClarityBoosts(JSON.parse(saved));
            } catch (error) {
                console.error('Failed to load clarity boosts:', error);
            }
        }
    }, []);

    // Save Clarity Boosts
    useEffect(() => {
        localStorage.setItem('oracle_clarity_boosts', JSON.stringify(clarityBoosts));
    }, [clarityBoosts]);

    return (
        <div className="neural-container">
            {/* Header */}
            <header className="neural-header">
                <div className="header-top">
                    <div className="header-title-group">
                        <Link href="/game" className="back-link">
                            <span className="back-arrow">←</span> DISCONNECT
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="title-glitch">NEURAL LINK ESTABLISHED</h1>
                            {oracleLevel > 1 && (
                                <div className="text-xs tracking-[0.3em] text-gold animate-pulse font-bold mt-1">
                                    ORACLE LEVEL {oracleLevel} // ASCENDED
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="connection-status">
                        <div className="signal-strength">
                            <div className="signal-label">SIGNAL:</div>
                            <div className="signal-bars">
                                {[1, 2, 3, 4, 5].map(bar => (
                                    <div
                                        key={bar}
                                        className={`signal-bar ${bar * 20 <= connectionStrength ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                            <div className="signal-percent">{Math.round(connectionStrength)}%</div>
                        </div>
                    </div>
                </div>

                <div className="wallet-display">
                    <div className="stars-count">
                        <div className="star-icon">⭐</div>
                        <div className="stars-amount">{wallet.balance}</div>
                        <div className="stars-label">COSMIC STARS</div>
                    </div>
                    <div className="wallet-stats">
                        <div className="stat">
                            <span className="stat-label">Today:</span>
                            <span className="stat-value">{StarSystem.getTodayEarnings()} ⭐</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Total Earned:</span>
                            <span className="stat-value">{wallet.totalEarned} ⭐</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="neural-main">
                {/* Left Panel - Messages List */}
                <aside className="messages-panel">
                    <h2 className="panel-title">
                        <span className="title-text">ORACLE MESSAGES</span>
                        <span className="title-count">{messages.filter(m => m.unlocked).length}/{messages.length}</span>
                    </h2>

                    <div className="messages-list">
                        {messages.map(message => (
                            <div
                                key={message.id}
                                className={`message-card ${message.unlocked ? 'unlocked' : 'locked'} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                                onClick={() => {
                                    if (message.unlocked) {
                                        setSelectedMessage(message);
                                        playSound('select');
                                    }
                                }}
                            >
                                <div className="message-header">
                                    <div className="message-title">
                                        <span className="title-text">{message.title}</span>
                                        <span className="message-category">{message.category}</span>
                                    </div>
                                    <div className="message-cost">
                                        {message.unlocked ? (
                                            <span className="unlocked-badge">UNLOCKED</span>
                                        ) : (
                                            <>
                                                <span className="cost-icon">⭐</span>
                                                <span className="cost-amount">{message.cost}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="message-preview">
                                    {message.unlocked ? (
                                        <div className="preview-text">
                                            {message.content.substring(0, 80)}...
                                        </div>
                                    ) : (
                                        <div className="preview-locked">
                                            {'*'.repeat(30)}... ENCRYPTED
                                        </div>
                                    )}
                                </div>

                                <div className="message-footer">
                                    {message.unlocked ? (
                                        <div className="clarity-display">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="clarity-label text-[10px] tracking-widest text-purple-300">CLARITY</div>
                                                <div className="clarity-percent text-[10px] font-bold text-white">
                                                    {getMessageClarity(message)}%
                                                </div>
                                            </div>

                                            {/* Visual Clarity Bar */}
                                            <div className="h-2 bg-gray-800 rounded-full border border-gray-700 overflow-hidden relative">
                                                <div
                                                    style={{ width: `${getMessageClarity(message)}%` }}
                                                    className={`h-full bg-gradient-to-r transition-all duration-500 ease-out ${getMessageClarity(message) >= 100
                                                        ? 'from-yellow-400 via-orange-400 to-yellow-200 animate-pulse'
                                                        : 'from-purple-600 to-amber-400'
                                                        }`}
                                                ></div>

                                                {/* Scan line effect for active bars */}
                                                {getMessageClarity(message) > 0 && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full animate-[shimmer_2s_infinite]" />
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            className="unlock-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                unlockMessage(message.id);
                                            }}
                                            disabled={wallet.balance < message.cost || isProcessing}
                                        >
                                            {wallet.balance < message.cost ? 'NEED STARS' : 'UNLOCK'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Center Panel - Oracle Display */}
                <section className="oracle-display">
                    <div className="display-header">
                        <h3 className="display-title">
                            {selectedMessage?.title || 'NEURAL INTERFACE'}
                        </h3>
                        <div className="display-controls">
                            <button
                                className="control-btn audio-btn"
                                onClick={() => setAudioEnabled(!audioEnabled)}
                                title={audioEnabled ? 'Disable audio' : 'Enable audio'}
                            >
                                {audioEnabled ? '🔊' : '🔇'}
                            </button>
                            <button
                                className="control-btn help-btn"
                                title="How to use"
                                onClick={() => alert('Collect stars from Miracles → Spend here → Increase clarity')}
                            >
                                ?
                            </button>
                        </div>
                    </div>

                    <div className="message-display">
                        {selectedMessage ? (
                            <>
                                <div className="message-content">
                                    <div className="content-glitch">
                                        <div className="glitch-overlay" style={{ opacity: (100 - getMessageClarity(selectedMessage)) / 100 }} />
                                        <div className="glitch-lines">
                                            {Array.from({ length: 3 }).map((_, i) => (
                                                <div key={i} className="glitch-line" style={{ animationDelay: `${i * 0.3}s` }} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="content-text">
                                        {renderTextWithClarity(selectedMessage.content, getMessageClarity(selectedMessage))}
                                    </div>
                                </div>

                                <div className="message-meta">
                                    <div className="meta-item">
                                        <span className="meta-label">Category:</span>
                                        <span className="meta-value">{selectedMessage.category.toUpperCase()}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-label">Unlocked:</span>
                                        <span className="meta-value">
                                            {selectedMessage.unlockedAt
                                                ? new Date(selectedMessage.unlockedAt).toLocaleDateString()
                                                : 'NOT UNLOCKED'}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="no-message">
                                <div className="no-message-icon">✦</div>
                                <div className="no-message-text">
                                    SELECT A MESSAGE FROM THE PANEL
                                    <br />
                                    <span className="no-message-subtext">
                                        Or unlock new messages with stars
                                    </span>
                                </div>
                                <div className="scan-animation">
                                    <div className="scan-line" />
                                </div>
                            </div>
                        )}
                    </div>

                    {selectedMessage && (
                        <div className="enhance-panel">
                            <h4 className="enhance-title">ENHANCE CLARITY</h4>
                            <div className="enhance-options">
                                <button
                                    className="enhance-option"
                                    onClick={() => enhanceClarity(selectedMessage.id, 10, 5)}
                                    disabled={wallet.balance < 5 || getMessageClarity(selectedMessage) >= 100 || isProcessing}
                                >
                                    <div className="option-header">
                                        <span className="option-name">Minor Boost</span>
                                        <span className="option-cost">⭐ 5</span>
                                    </div>
                                    <div className="option-desc">+10% Clarity</div>
                                </button>

                                <button
                                    className="enhance-option"
                                    onClick={() => enhanceClarity(selectedMessage.id, 25, 15)}
                                    disabled={wallet.balance < 15 || getMessageClarity(selectedMessage) >= 100 || isProcessing}
                                >
                                    <div className="option-header">
                                        <span className="option-name">Major Boost</span>
                                        <span className="option-cost">⭐ 15</span>
                                    </div>
                                    <div className="option-desc">+25% Clarity</div>
                                </button>

                                <button
                                    className="enhance-option"
                                    onClick={() => enhanceClarity(selectedMessage.id, 50, 30)}
                                    disabled={wallet.balance < 30 || getMessageClarity(selectedMessage) >= 100 || isProcessing}
                                >
                                    <div className="option-header">
                                        <span className="option-name">Perfect Clarity</span>
                                        <span className="option-cost">⭐ 30</span>
                                    </div>
                                    <div className="option-desc">+50% Clarity</div>
                                </button>
                            </div>

                            <div className="clarity-info">
                                <div className="info-item">
                                    <span className="info-label">Current:</span>
                                    <span className="info-value">{getMessageClarity(selectedMessage)}%</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Base:</span>
                                    <span className="info-value">{selectedMessage.baseClarity}%</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Boosted:</span>
                                    <span className="info-value">+{(clarityBoosts[selectedMessage.id] || 0)}%</span>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Right Panel - Shop & Stats */}
                <aside className="shop-panel">
                    <h2 className="shop-title">COSMIC MARKET</h2>

                    <div className="shop-section">
                        <h3 className="section-title">CLARITY PACKAGES</h3>
                        <div className="shop-items">
                            <div className="shop-item">
                                <div className="item-header">
                                    <span className="item-name">Global Boost I</span>
                                    <span className="item-cost">⭐ 50</span>
                                </div>
                                <div className="item-desc">+5% clarity to ALL messages</div>
                                <button
                                    className="item-button"
                                    onClick={() => {
                                        Object.keys(clarityBoosts).forEach(msgId => {
                                            enhanceClarity(msgId, 5, 0);
                                        });
                                        StarSystem.spendStars(50, 'clarity');
                                        updateWallet();
                                    }}
                                    disabled={wallet.balance < 50}
                                >
                                    PURCHASE
                                </button>
                            </div>

                            <div className="shop-item">
                                <div className="item-header">
                                    <span className="item-name">Connection Upgrade</span>
                                    <span className="item-cost">⭐ 100</span>
                                </div>
                                <div className="item-desc">Unlocks secret messages + boosts</div>
                                <button
                                    className="item-button"
                                    onClick={() => {
                                        setConnectionStrength(100);
                                        StarSystem.spendStars(100, 'unlock');
                                        updateWallet();
                                        alert('Secret connection established!');
                                    }}
                                    disabled={wallet.balance < 100}
                                >
                                    UPGRADE
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="shop-section">
                        <h3 className="section-title">YOUR STATS</h3>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-name">Messages Unlocked</div>
                                <div className="stat-value">{messages.filter(m => m.unlocked).length}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-name">Total Clarity</div>
                                <div className="stat-value">
                                    {Object.values(clarityBoosts).reduce((a, b) => a + b, 0)}%
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-name">Connection</div>
                                <div className="stat-value">{Math.round(connectionStrength)}%</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-name">Spent Today</div>
                                <div className="stat-value">
                                    {wallet.transactions
                                        .filter(t => t.type === 'spent' && new Date(t.timestamp).toDateString() === new Date().toDateString())
                                        .reduce((sum, t) => sum + t.amount, 0)} ⭐
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-box">
                        <h4 className="info-title">HOW IT WORKS</h4>
                        <ul className="info-list">
                            <li>• Collect stars from <strong>Miracles</strong> on the Cosmic Heart</li>
                            <li>• Spend stars to <strong>unlock messages</strong> from the Oracle</li>
                            <li>• Increase <strong>clarity</strong> to reduce static and glitches</li>
                            <li>• Higher clarity reveals <strong>deeper meanings</strong></li>
                            <li>• Secret messages require <strong>upgraded connection</strong></li>
                        </ul>
                    </div>
                </aside>
            </main>

            {/* Connection Effects */}
            <div className="connection-effects">
                <div className="effect-particles">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                opacity: connectionStrength / 200
                            }}
                        />
                    ))}
                </div>
                <div className="effect-lines">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="connection-line"
                            style={{
                                animationDelay: `${i * 0.5}s`,
                                opacity: connectionStrength / 150
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
