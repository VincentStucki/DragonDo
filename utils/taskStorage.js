import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'TASKS';

export const getTasks = async () => {
    try {
        const tasksJSON = await AsyncStorage.getItem(TASKS_KEY);
        return tasksJSON != null ? JSON.parse(tasksJSON) : [];
    } catch (e) {
        console.error('Fehler beim Laden der Aufgaben:', e);
        return [];
    }
};

export const saveTasks = async (tasks) => {
    try {
        const json = JSON.stringify(tasks);
        await AsyncStorage.setItem(TASKS_KEY, json);
    } catch (e) {
        console.error('Fehler beim Speichern der Aufgaben:', e);
    }
};

// neuen Clear-Funktion hinzufügen
export const clearTasks = async () => {
    try {
        await AsyncStorage.removeItem(TASKS_KEY);
    } catch (e) {
        console.error('Fehler beim Leeren des Speichers:', e);
    }
};