"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";

interface UserInputProps {
    onSend: (text: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function UserInput({ onSend, disabled, placeholder = "Type your response..." }: UserInputProps) {
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() && !disabled) {
            onSend(text.trim());
            setText("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <div className="relative flex items-center">
                <div className="absolute left-3 text-magic-gold/50">
                    <Sparkles className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="w-full bg-black/60 border border-white/10 rounded-full py-3 pl-10 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-magic-gold/50 focus:bg-black/80 transition-all font-sans"
                />
                <button
                    type="submit"
                    disabled={!text.trim() || disabled}
                    className="absolute right-2 p-1.5 bg-magic-gold/10 rounded-full text-magic-gold hover:bg-magic-gold/20 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </form>
    );
}
