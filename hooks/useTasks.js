import { useEffect, useState } from 'react';
import { getTasks, saveTasks } from '../utils/taskStorage';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const savedTasks = await getTasks();
        setTasks(savedTasks);
    };

    const addTask = async (task) => {
        const newTasks = [...tasks, { ...task, done: false }];
        setTasks(newTasks);
        await saveTasks(newTasks);
    };

    const toggleDone = async (index) => {
        const newTasks = [...tasks];
        newTasks[index].done = !newTasks[index].done;
        setTasks(newTasks);
        await saveTasks(newTasks);
    };

    return {
        tasks,
        setTasks,
        addTask,
        toggleDone,
        reloadTasks: loadTasks
    };
};
