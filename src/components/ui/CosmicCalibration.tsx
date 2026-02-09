"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PixelCard } from "./PixelCard";
import { CityAutocomplete } from "./CityAutocomplete";
import { Sparkles, Orbit } from "lucide-react";

interface CosmicCalibrationProps {
    onComplete: (data: {
        name: string;
        date: string;
        time: string;
        location: string;
        latitude: number;
        longitude: number;
    }) => void;
}

export function CosmicCalibration({ onComplete }: CosmicCalibrationProps) {
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
            <PixelCard className="bg-[#0a0a1a] border-cyan-400 p-8 relative overflow-hidden min-h-[500px] flex flex-col justify-center shadow-[0_0_40px_rgba(0,255,255,0.3)]">
                {/* Animated Background Grid */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.3) 25%, rgba(0, 255, 255, 0.3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.3) 75%, rgba(0, 255, 255, 0.3) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.3) 25%, rgba(0, 255, 255, 0.3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.3) 75%, rgba(0, 255, 255, 0.3) 76%, transparent 77%, transparent)
            `,
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                {/* Decorative Corner Elements */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-400" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-400" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400" />

                <div className="relative z-10">
                    <header className="text-center mb-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="inline-block mb-4"
                        >
                            <Orbit className="w-12 h-12 text-cyan-400" />
                        </motion.div>

                        <h2 className="text-3xl text-cyan-400 font-bold uppercase tracking-[0.3em] mb-2 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                            Cosmic Calibration
                        </h2>
                        <p className="text-magic-gold text-sm tracking-widest font-pixel mb-3">
                            INITIALIZE SIGNATURE PROTOCOL
                        </p>
                        <div className="h-0.5 w-2/3 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                        <p className="text-white/60 text-xs mt-3 max-w-md mx-auto">
                            Enter your temporal and spatial coordinates to generate your unique Cosmic Signature.
                            This will determine your access to the Archive's data streams.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-cyan-400 text-xs uppercase tracking-widest block flex items-center gap-2">
                                <span className="text-magic-gold">▸</span>
                                Traveler Designation
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full bg-black/60 border-2 border-cyan-400/30 p-3 text-white focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all font-pixel text-sm placeholder:text-white/30"
                                placeholder="Enter your name..."
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-cyan-400 text-xs uppercase tracking-widest block flex items-center gap-2">
                                    <span className="text-magic-gold">▸</span>
                                    Calibration Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-black/60 border-2 border-cyan-400/30 p-3 text-white focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all font-pixel text-sm uppercase"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-cyan-400 text-xs uppercase tracking-widest block flex items-center gap-2">
                                    <span className="text-magic-gold">▸</span>
                                    Temporal Coordinates
                                </label>
                                <input
                                    type="time"
                                    required
                                    className="w-full bg-black/60 border-2 border-cyan-400/30 p-3 text-white focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all font-pixel text-sm"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-cyan-400 text-xs uppercase tracking-widest block flex items-center gap-2">
                                <span className="text-magic-gold">▸</span>
                                Spatial Coordinates
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
                                className="group relative px-10 py-4 bg-black/80 border-2 border-cyan-400 text-cyan-400 uppercase tracking-widest font-bold text-sm shadow-[4px_4px_0px_rgba(0,255,255,0.3)] hover:shadow-[6px_6px_0px_rgba(0,255,255,0.5)] transition-all"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    <Sparkles className="w-5 h-5" />
                                    Initialize Cosmic Signature
                                    <Sparkles className="w-5 h-5" />
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-cyan-400/10"
                                    animate={{
                                        opacity: [0, 0.3, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </motion.button>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex justify-center gap-4 pt-4">
                            <div className="flex items-center gap-2 text-xs">
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-cyan-400"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-white/60 font-pixel">SYSTEM READY</span>
                            </div>
                        </div>
                    </form>
                </div>
            </PixelCard>
        </motion.div>
    );
}
