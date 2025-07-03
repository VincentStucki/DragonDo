// context/TaskContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'TASKS';
const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    const loadTasks = async () => {
        try {
            const json = await AsyncStorage.getItem(TASKS_KEY);
            setTasks(json ? JSON.parse(json) : []);
        } catch (e) {
            console.error('Fehler beim Laden der Aufgaben:', e);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const addTask = async (task) => {
        const next = [...tasks, { ...task, done: false }];
        setTasks(next);
        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(next));
    };

    const toggleDone = async (index) => {
        const next = [...tasks];
        next[index].done = !next[index].done;
        setTasks(next);
        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(next));
    };

    const deleteTask = async (taskToDelete) => {
        const next = tasks.filter(t => t !== taskToDelete);
        setTasks(next);
        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(next));
    };

    const updateTask = async ({ original, newData }) => {
        const next = tasks.map(t => t === original ? newData : t);
        setTasks(next);
        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(next));
    };

    // Clears both AsyncStorage and context state
    const clearAllTasks = async () => {
        try {
            setTasks([]);
            await AsyncStorage.removeItem(TASKS_KEY);
        } catch (e) {
            console.error('Fehler beim Leeren des Speichers:', e);
        }
    };

    return (
        <TaskContext.Provider value={{
            tasks,
            addTask,
            toggleDone,
            deleteTask,
            updateTask,
            clearAllTasks,
            reloadTasks: loadTasks
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => useContext(TaskContext);