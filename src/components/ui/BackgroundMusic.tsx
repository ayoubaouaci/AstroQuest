"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface BackgroundMusicProps {
    src: string;
    volume?: number; // 0 to 1
}

export function BackgroundMusic({ src, volume = 0.5 }: BackgroundMusicProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const audio = new Audio(src);
        audio.loop = true;
        audio.volume = volume;
        audioRef.current = audio;

        // Auto-play attempt
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.log("Auto-play prevented (brower policy). User interaction needed.");
                setIsPlaying(false);
            });
        }

        return () => {
            audio.pause();
            audio.src = "";
        };
    }, [src, volume]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    }

    return (
        <div className="fixed bottom-4 left-4 z-50 flex gap-2">
            <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-black/50 border border-magic-gold/30 text-magic-gold hover:bg-black/80 transition-all backdrop-blur-sm"
                title={isPlaying ? "Pause Music" : "Play Music"}
            >
                {isPlaying ? (
                    <div className="flex gap-0.5 h-4 items-end">
                        <span className="w-1 bg-magic-gold animate-[music-bar_1s_ease-in-out_infinite]" />
                        <span className="w-1 bg-magic-gold animate-[music-bar_1.2s_ease-in-out_infinite]" />
                        <span className="w-1 bg-magic-gold animate-[music-bar_0.8s_ease-in-out_infinite]" />
                    </div>
                ) : (
                    <span className="text-xs font-bold text-center w-4 block">▶</span>
                )}
            </button>
            <button
                onClick={toggleMute}
                className="hidden md:block p-2 rounded-full bg-black/50 border border-magic-gold/30 text-magic-gold/70 hover:text-magic-gold hover:bg-black/80 transition-all backdrop-blur-sm"
            >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
        </div>
    );
}
