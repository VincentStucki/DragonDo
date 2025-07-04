// context/XPContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const XP_KEY = 'USER_XP';
export const XP_THRESHOLDS = [0, 100, 250, 500, 1000];
export const EVOLUTION_STAGES = ['dragonegg', 'babydragon', 'teendragon', 'adultdragon', 'legendarydragon'];

const XPContext = createContext();

export const XPProvider = ({ children }) => {
    const [xp, setXp] = useState(0);

    useEffect(() => {
        AsyncStorage.getItem(XP_KEY)
            .then(v => { if (v != null) setXp(parseInt(v, 10)); })
            .catch(() => { });
    }, []);

    const addXP = async amount => {
        const next = xp + amount;
        setXp(next);
        await AsyncStorage.setItem(XP_KEY, next.toString());
    };

    const resetXP = async () => {
        setXp(0);
        await AsyncStorage.removeItem(XP_KEY);
    };

    return (
        <XPContext.Provider value={{ xp, addXP, resetXP }}>
            {children}
        </XPContext.Provider>
    );
};

export const useXP = () => useContext(XPContext);
