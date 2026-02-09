'use client';

export interface StarTransaction {
    id: string;
    type: 'earned' | 'spent' | 'bonus';
    amount: number;
    reason: 'miracle' | 'daily' | 'streak' | 'clarity' | 'unlock' | 'collect' | 'bonus';
    timestamp: number;
}

export interface StarWallet {
    balance: number;
    totalEarned: number;
    totalSpent: number;
    transactions: StarTransaction[];
}

export class StarSystem {
    private static STORAGE_KEY = 'cosmic_star_wallet';

    static getWallet(): StarWallet {
        if (typeof window === 'undefined') {
            return this.getDefaultWallet();
        }

        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return this.getDefaultWallet();
            }
        }

        return this.getDefaultWallet();
    }

    private static getDefaultWallet(): StarWallet {
        return {
            balance: 0,
            totalEarned: 0,
            totalSpent: 0,
            transactions: []
        };
    }

    static earnStars(amount: number, reason: StarTransaction['reason']): StarWallet {
        const wallet = this.getWallet();
        const transaction: StarTransaction = {
            id: `star_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'earned',
            amount,
            reason,
            timestamp: Date.now()
        };

        const updatedWallet: StarWallet = {
            balance: wallet.balance + amount,
            totalEarned: wallet.totalEarned + amount,
            totalSpent: wallet.totalSpent,
            transactions: [transaction, ...wallet.transactions].slice(0, 100) // Keep last 100
        };

        this.saveWallet(updatedWallet);
        return updatedWallet;
    }

    static spendStars(amount: number, reason: StarTransaction['reason']): { success: boolean; wallet: StarWallet | null } {
        const wallet = this.getWallet();

        if (wallet.balance < amount) {
            return { success: false, wallet: null };
        }

        const transaction: StarTransaction = {
            id: `star_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'spent',
            amount,
            reason,
            timestamp: Date.now()
        };

        const updatedWallet: StarWallet = {
            balance: wallet.balance - amount,
            totalEarned: wallet.totalEarned,
            totalSpent: wallet.totalSpent + amount,
            transactions: [transaction, ...wallet.transactions].slice(0, 100)
        };

        this.saveWallet(updatedWallet);
        return { success: true, wallet: updatedWallet };
    }

    static canAfford(amount: number): boolean {
        return this.getWallet().balance >= amount;
    }

    private static saveWallet(wallet: StarWallet): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(wallet));
        }
    }

    static reset(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.STORAGE_KEY);
        }
    }

    static getTodayEarnings(): number {
        const wallet = this.getWallet();
        const today = new Date().toDateString();

        return wallet.transactions
            .filter(t => t.type === 'earned' && new Date(t.timestamp).toDateString() === today)
            .reduce((sum, t) => sum + t.amount, 0);
    }

    static getStats() {
        const wallet = this.getWallet();
        const todayEarnings = this.getTodayEarnings();

        return {
            balance: wallet.balance,
            todayEarnings,
            totalEarned: wallet.totalEarned,
            totalSpent: wallet.totalSpent,
            transactionCount: wallet.transactions.length
        };
    }

    static checkDailyBonus(): number {
        if (typeof window === 'undefined') return 0;

        const today = new Date().toDateString();
        const lastLogin = localStorage.getItem('cosmic_daily_last_login');

        if (lastLogin !== today) {
            localStorage.setItem('cosmic_daily_last_login', today);
            this.earnStars(5, 'daily');
            return 5;
        }

        return 0;
    }
}
