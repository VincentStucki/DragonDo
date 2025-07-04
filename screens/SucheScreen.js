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

    useEffect(() => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        tasks.forEach(task => {
            const d = new Date(task.date); d.setHours(0, 0, 0, 0);
            if (d < today) deleteTask(task);
        });
    }, [tasks]);

    const filteredAndSorted = useMemo(() => {
        const now = new Date();
        return tasks
            .filter(t => t.title.toLowerCase().includes(searchText.toLowerCase()))
            .map(t => ({
                task: t,
                date: new Date(t.date),
                past: new Date(t.date) < now
            }))
            .sort((a, b) => {
                const ca = new Date(a.task.createdAt || a.date);
                const cb = new Date(b.task.createdAt || b.date);
                return cb - ca;
            });
    }, [tasks, searchText]);


    const getPriorityColor = p => ({
        '1': '#EDE7F6', '2': '#D1C4E9',
        '3': '#B39DDB', '4': '#9575CD',
        '5': '#7E57C2'
    }[p] || '#EDE7F6');

    const getRecurrenceIcon = r =>
        r === 'Einmalig' ? 'calendar-outline' : 'repeat';

    const getTextColor = (p) => {
        switch (p) {
            case '1': return '#222';
            case '2': return '#333';
            case '3': return '#fff';
            case '4': return '#fff';
            case '5': return '#eee';
            default: return '#fff';
        }
    };

    const getPriorityBackground = (p) => ({
        '1': '#EDE7F6',
        '2': '#D1C4E9',
        '3': '#B39DDB',
        '4': '#9575CD',
        '5': '#7E57C2',
    }[p] || '#B39DDB');

    const onRadioPress = ({ task, date, past }, idx) => {
        if (task.done) return;
        if (!past) {
            setPending({ task, idx });
            setConfirmVisible(true);
        } else {
            doCheck({ task, idx }, false);
        }
    };

    const doCheck = async ({ task, idx }, withXP = true) => {
        await checkTask(idx);
        if (withXP) {
            const xp = getXPFromPriority(task.priority);
            console.log(`Gewonnene XP: ${xp}`);
        }
        setConfirmVisible(false);
        setPending(null);
    };

    return (
        <ImageBackground source={require('../assets/background.png')} style={styles.background} resizeMode="cover">
            <AppBackground style={styles.container}>

                {/* Moderne Suchleiste */}
                <View style={styles.searchWrapper}>
                    <Ionicons name="search" size={20} color="#bbb" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Suche nach Titel..."
                        placeholderTextColor="#bbb"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                <ScrollView style={styles.taskList}>
                    <Text style={styles.subHeader}>Kürzlich erstellt</Text>
                    {filteredAndSorted.map(({ task, date, past }, i) => {
                        const done = task.done;
                        let borderColor = 'transparent';
                        if (done) {
                            borderColor = new Date(task.doneAt) <= date ? 'green' : 'yellow';
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
                                        backgroundColor: getPriorityBackground(task.priority),
                                        borderColor,
                                        borderWidth: borderColor === 'transparent' ? 0 : 2,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => onRadioPress({ task, date, past }, i)}
                                    style={styles.radioButton}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    {done && (
                                        <Ionicons name="checkmark" size={20} color="#7E57C2" />
                                    )}
                                </TouchableOpacity>

                                <View style={styles.separator} />

                                <View style={styles.titleRow}>
                                    <Text style={[styles.taskTitle, { color: getTextColor(task.priority) }]}>
                                        {task.title}
                                    </Text>
                                    <Ionicons
                                        name={getRecurrenceIcon(task.recurrence)}
                                        size={18}
                                        color={getTextColor(task.priority)}
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
                    onConfirm={() => pending && doCheck(pending, true)}
                />
            </AppBackground>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        padding: 20,
        paddingBottom: 90,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },

    // Stylische Suchleiste
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 30,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginTop: 50,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        padding: 0,
    },

    subHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: '#C7AFFF',
        marginBottom: 12,
        marginLeft: 4,
    },
    taskList: {
        flex: 1,
    },
    taskBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
    },
    radioButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#7E57C2',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginRight: 12,
    },
    separator: {
        width: 1,
        height: 24,
        backgroundColor: '#7E57C2',
        marginRight: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        flex: 1,
        fontWeight: '500',
    },
});
