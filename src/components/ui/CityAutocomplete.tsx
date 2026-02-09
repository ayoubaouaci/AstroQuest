"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

interface City {
    id: number;
    name: string;
    country: string;
    latitude: number;
    longitude: number;
}

interface CityAutocompleteProps {
    value: string;
    onChange: (city: { name: string; latitude: number; longitude: number }) => void;
}

export function CityAutocomplete({ value, onChange }: CityAutocompleteProps) {
    const [inputValue, setInputValue] = useState(value);
    const [cities, setCities] = useState<City[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const searchCities = async () => {
            if (inputValue.length < 2) {
                setCities([]);
                setIsOpen(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(
                        inputValue
                    )}&limit=5&sort=-population`,
                    {
                        headers: {
                            "X-RapidAPI-Key": "demo", // Using demo key for testing
                            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    const cityData = data.data.map((city: any) => ({
                        id: city.id,
                        name: city.name,
                        country: city.country,
                        latitude: city.latitude,
                        longitude: city.longitude,
                    }));
                    setCities(cityData);
                    setIsOpen(cityData.length > 0);
                }
            } catch (error) {
                console.error("Error fetching cities:", error);
                setCities([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(searchCities, 300);
        return () => clearTimeout(debounce);
    }, [inputValue]);

    const handleSelect = (city: City) => {
        const displayName = `${city.name}, ${city.country}`;
        setInputValue(displayName);
        onChange({
            name: displayName,
            latitude: city.latitude,
            longitude: city.longitude,
        });
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    required
                    className="w-full bg-black/40 border-2 border-magic-gold/30 p-3 pl-10 text-white focus:border-magic-gold focus:outline-none focus:shadow-[0_0_10px_#FFD700] transition-all font-pixel text-sm"
                    placeholder="Start typing city..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => cities.length > 0 && setIsOpen(true)}
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-astral-blue" />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-2 bg-midnight-purple border-2 border-magic-gold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] max-h-60 overflow-y-auto"
                    >
                        {isLoading ? (
                            <div className="p-3 text-center text-astral-blue text-xs">
                                Searching the cosmos...
                            </div>
                        ) : cities.length > 0 ? (
                            cities.map((city) => (
                                <motion.div
                                    key={city.id}
                                    whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
                                    className="p-3 cursor-pointer border-b border-magic-gold/20 last:border-b-0"
                                    onClick={() => handleSelect(city)}
                                >
                                    <div className="text-white text-sm font-pixel">
                                        {city.name}
                                    </div>
                                    <div className="text-astral-blue text-xs mt-1">
                                        {city.country}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-3 text-center text-gray-400 text-xs">
                                No cities found
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
