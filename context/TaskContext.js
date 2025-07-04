import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'TASKS';
const TaskContext = createContext();
//Für die Speicherung der Tasks zuständig
export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    //Ladet die Tasks
    const load = async () => {
        const json = await AsyncStorage.getItem(TASKS_KEY);
        setTasks(json ? JSON.parse(json) : []);
    };
    useEffect(() => { load(); }, []);

    const persist = async next => {
        setTasks(next);
        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(next));
    };
    //Hinzufügen
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
    //Löschen
    const deleteTask = async t => {
        const next = tasks.filter(x => x !== t);
        await persist(next);
    };
    //Alles löschen
    const clearAllTasks = async () => {
        setTasks([]);                         // leere den State
        await AsyncStorage.removeItem(TASKS_KEY); // lösche den Key
    };
    //Bearbeiten
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
