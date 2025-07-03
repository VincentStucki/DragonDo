// context/XPContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const XP_KEY = 'XP_TOTAL';
export const XP_THRESHOLDS = [0, 50, 150, 300, 500];
export const EVOLUTION_STAGES = [
    'dragonegg',
    'babydragon',
    'teendragon',
    'adultdragon',
    'legendarydragon'
];

const XPContext = createContext();

export function XPProvider({ children }) {
    const [xp, setXp] = useState(0);

    // Beim Mounten aus Storage laden
    useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem(XP_KEY);
            setXp(saved ? parseInt(saved, 10) : 0);
        })();
    }, []);

    // XP hinzufügen + speichern
    const addXP = async (priority) => {
        const gained = priority * 10;         // z.B. Prio 3 → 30 XP
        const next = xp + gained;
        setXp(next);
        await AsyncStorage.setItem(XP_KEY, next.toString());
    };

    return (
        <XPContext.Provider value={{ xp, addXP }}>
            {children}
        </XPContext.Provider>
    );
}

export function useXP() {
    return useContext(XPContext);
}
