"use client";

import { useState, useEffect } from 'react';

export type SavedCity = {
  name: string;
  status: string;
  savedAt: string;
  lastChecked?: string;
};

export function useSavedCities() {
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('savedCities');
    if (stored) {
      try {
        setSavedCities(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load saved cities:', e);
      }
    }
  }, []);

  const saveCity = (city: SavedCity) => {
    const exists = savedCities.some(c => c.name.toLowerCase() === city.name.toLowerCase());
    if (exists) return false;

    const updated = [...savedCities, city];
    setSavedCities(updated);
    localStorage.setItem('savedCities', JSON.stringify(updated));
    return true;
  };

  const removeCity = (cityName: string) => {
    const updated = savedCities.filter(c => c.name.toLowerCase() !== cityName.toLowerCase());
    setSavedCities(updated);
    localStorage.setItem('savedCities', JSON.stringify(updated));
  };

  const isCitySaved = (cityName: string) => {
    return savedCities.some(c => c.name.toLowerCase() === cityName.toLowerCase());
  };

  const updateLastChecked = (cityName: string) => {
    const updated = savedCities.map(c => 
      c.name.toLowerCase() === cityName.toLowerCase() 
        ? { ...c, lastChecked: new Date().toISOString() }
        : c
    );
    setSavedCities(updated);
    localStorage.setItem('savedCities', JSON.stringify(updated));
  };

  return {
    savedCities,
    saveCity,
    removeCity,
    isCitySaved,
    updateLastChecked,
  };
}