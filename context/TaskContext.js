import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'TASKS';
const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    const load = async () => {
        const json = await AsyncStorage.getItem(TASKS_KEY);
        setTasks(json ? JSON.parse(json) : []);
    };
    useEffect(() => { load(); }, []);

    const persist = async next => {
        setTasks(next);
        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(next));
    };

    const addTask = async task => {
        const next = [...tasks, { ...task, done: false }];
        await persist(next);
    };

    // ersetzt toggleDone
    const checkTask = async index => {
        const next = [...tasks];
        if (next[index].done) return;           // Uncheck nicht erlaubt
        next[index].done = true;
        next[index].doneAt = new Date().toString();
        await persist(next);
    };

    const deleteTask = async t => {
        const next = tasks.filter(x => x !== t);
        await persist(next);
    };

    const clearAllTasks = async () => {
        setTasks([]);                         // leere den State
        await AsyncStorage.removeItem(TASKS_KEY); // lösche den Key
    };

    const updateTask = async ({ original, newData }) => {
        const next = tasks.map(x => x === original ? newData : x);
        await persist(next);
    };

    return (
        <TaskContext.Provider value={{
            tasks, addTask, checkTask, deleteTask, updateTask, clearAllTasks, reloadTasks: load
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => useContext(TaskContext);
