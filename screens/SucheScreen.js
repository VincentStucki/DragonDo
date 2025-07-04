// screens/SucheScreen.js
import React, { useState, useEffect, useMemo } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, TextInput, ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FloatingButton from '../components/FloatingButton';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import ConfirmModal from '../components/ConfirmModal';
import { useTasks } from '../context/TaskContext';
import { getXPFromPriority } from '../utils/xp';
import AppBackground from '../components/AppBackground';

export default function SucheScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [pendingTask, setPendingTask] = useState(null);
    const [pending, setPending] = useState(null);

    const { tasks, addTask, checkTask, deleteTask, updateTask } = useTasks();

    // Alte Tasks automatisch entfernen
    useEffect(() => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        tasks.forEach(task => {
            const d = new Date(task.date); d.setHours(0, 0, 0, 0);
            if (d < today) deleteTask(task);
        });
    }, [tasks]);

    // Filtern & Sortieren
    const filteredAndSorted = useMemo(() => {
        const now = new Date();
        return tasks
            .filter(t => t.title.toLowerCase().includes(searchText.toLowerCase()))
            .map(t => ({
                task: t,
                date: new Date(t.date),
                past: new Date(t.date) < now
            }))
            .sort((a, b) => b.date - a.date);
    }, [tasks, searchText]);

    const getPriorityColor = p => ({
        '1': '#EDE7F6', '2': '#D1C4E9',
        '3': '#B39DDB', '4': '#9575CD',
        '5': '#7E57C2'
    }[p] || '#EDE7F6');

    const getRecurrenceIcon = r =>
        r === 'Einmalig' ? 'calendar-outline' : 'repeat';

    // Klick auf Radiobutton
    const onRadioPress = ({ task, date, past }, idx) => {
        if (task.done) return;
        if (!past) {
            setPending({ task, idx });       // ← hier Index mitgeben
            setConfirmVisible(true);
        } else {
            doCheck({ task, idx }, false);   // direkt abhaken, ohne XP
        }
    };

    // tatsächlich abhaken + optional XP-Log
    const doCheck = async ({ task, idx }, withXP = true) => {
        await checkTask(idx);
        if (withXP) {
            const xp = getXPFromPriority(task.priority); // Index stimmt jetzt
            console.log(`Gewonnene XP: ${xp}`);
        }
        setConfirmVisible(false);
        setPending(null);
    };

    return (
        <ImageBackground source={require('../assets/background.png')} style={styles.background} resizeMode="cover">
            <AppBackground style={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Suche nach Titel..."
                    value={searchText}
                    onChangeText={setSearchText}
                />

                <ScrollView style={styles.taskList}>
                    <Text style={styles.subHeader}>Kürzlich erstellt</Text>
                    {filteredAndSorted.map(({ task, date, past }, i) => {
                        const done = task.done;
                        // Rahmenfarben:
                        //   erledigt + doneAt>date → grün
                        //   erledigt + past      → gelb
                        //   past & !done         → rot
                        let borderColor = 'transparent';
                        if (done) {
                            borderColor = date < new Date(task.doneAt) ? 'green' : 'yellow';
                        } else if (past) {
                            borderColor = 'red';
                        }

                        return (
                            <TouchableOpacity
                                key={i}
                                onPress={() => setSelectedTask(task)}
                                style={[
                                    styles.taskBox,
                                    {
                                        backgroundColor: getPriorityColor(task.priority),
                                        borderColor,
                                        borderWidth: borderColor === 'transparent' ? 0 : 2
                                    }
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => onRadioPress({ task, date, past })}
                                    style={styles.radioButton}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    {done && (
                                        <Ionicons name="checkmark" size={20} color="#7E57C2" />
                                    )}
                                </TouchableOpacity>

                                <View style={styles.separator} />

                                <View style={styles.titleRow}>
                                    <Text style={styles.taskTitle}>{task.title}</Text>
                                    <Ionicons
                                        name={getRecurrenceIcon(task.recurrence)}
                                        size={18}
                                        color="#7E57C2"
                                        style={{ marginLeft: 8 }}
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <FloatingButton onPress={() => setModalVisible(true)} />

                <AddTaskModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSubmit={addTask}
                />

                <TaskDetailModal
                    visible={!!selectedTask}
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onDelete={() => {
                        deleteTask(selectedTask);
                        setSelectedTask(null);
                    }}
                    onUpdate={upd => {
                        updateTask({ original: selectedTask, newData: upd });
                        setSelectedTask(null);
                    }}
                />

                <ConfirmModal
                    visible={confirmVisible}
                    message="Bist du sicher, dass du diese Aufgabe abhaken möchtest?"
                    onCancel={() => { setConfirmVisible(false); setPending(null); }}
                    onConfirm={() => pending && doCheck(pending, true)}  // nur noch pending
                />
            </AppBackground >
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    container: { flex: 1, padding: 20, paddingBottom: 90, backgroundColor: 'rgba(0,0,0,0.3)' },
    searchInput: {
        borderWidth: 1, borderColor: '#ccc',
        borderRadius: 10, padding: 10, marginBottom: 5,
        backgroundColor: '#fff'
    },
    subHeader: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        marginLeft: 4
    },
    taskList: { flex: 1 },
    taskBox: {
        flexDirection: 'row', alignItems: 'center',
        padding: 15, borderRadius: 12, marginBottom: 12
    },
    radioButton: {
        width: 28, height: 28, borderRadius: 14,
        borderWidth: 2, borderColor: '#7E57C2',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff', marginRight: 12
    },
    separator: {
        width: 1, height: 24,
        backgroundColor: '#7E57C2', marginRight: 12
    },
    titleRow: { flexDirection: 'row', alignItems: 'center' },
    taskTitle: { fontSize: 16, color: '#333', flex: 1 }
});
