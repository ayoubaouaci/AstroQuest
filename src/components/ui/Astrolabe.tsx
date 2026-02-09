"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PixelCard } from "./PixelCard";
import { CityAutocomplete } from "./CityAutocomplete";
import { Sparkles } from "lucide-react";

interface AstrolabeProps {
    onComplete: (data: {
        name: string;
        date: string;
        time: string;
        location: string;
        latitude: number;
        longitude: number;
    }) => void;
}

export function Astrolabe({ onComplete }: AstrolabeProps) {
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        time: "",
        location: "",
        latitude: 0,
        longitude: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete(formData);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="max-w-2xl w-full perspective-1000"
        >
            <PixelCard noDecor={true} className="bg-[#2a1a3e] !border-0 p-8 relative overflow-hidden min-h-[500px] flex flex-col justify-center shadow-none">


                <div className="relative z-10 w-full">
                    <header className="text-center mb-8">
                        <h2 className="text-2xl text-magic-gold font-bold uppercase tracking-[0.2em] mb-2 drop-shadow-md">
                            Artifact of Origin
                        </h2>
                        <div className="h-0.5 w-1/2 mx-auto bg-gradient-to-r from-transparent via-magic-gold to-transparent" />
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-astral-blue text-xs uppercase tracking-widest block">
                                Traveler's Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full bg-black/40 border-2 border-magic-gold/30 p-3 text-white focus:border-magic-gold focus:outline-none focus:shadow-[0_0_10px_#FFD700] transition-all font-pixel text-sm"
                                placeholder="Enter your name..."
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-astral-blue text-xs uppercase tracking-widest block">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-black/40 border-2 border-magic-gold/30 p-3 text-white focus:border-magic-gold focus:outline-none focus:shadow-[0_0_10px_#FFD700] transition-all font-pixel text-sm uppercase "
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-astral-blue text-xs uppercase tracking-widest block">
                                    Time of Origin
                                </label>
                                <input
                                    type="time"
                                    required
                                    className="w-full bg-black/40 border-2 border-magic-gold/30 p-3 text-white focus:border-magic-gold focus:outline-none focus:shadow-[0_0_10px_#FFD700] transition-all font-pixel text-sm"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-astral-blue text-xs uppercase tracking-widest block">
                                Place of Birth
                            </label>
                            <CityAutocomplete
                                value={formData.location}
                                onChange={(city) => setFormData({
                                    ...formData,
                                    location: city.name,
                                    latitude: city.latitude,
                                    longitude: city.longitude
                                })}
                            />
                        </div>

                        <div className="pt-6 flex justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-8 py-3 bg-midnight-purple border-2 border-magic-gold text-magic-gold uppercase tracking-widest font-bold text-sm shadow-[4px_4px_0px_#000]"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Consult the Stars
                                </span>
                                <div className="absolute inset-0 bg-magic-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute -inset-1 bg-magic-gold/20 blur-md opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
                            </motion.button>
                        </div>
                    </form>
                </div>
            </PixelCard>
        </motion.div>
    );
}
