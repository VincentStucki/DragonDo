import React, { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet,
    SectionList, TouchableOpacity,
    ActivityIndicator, ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FloatingButton from '../components/FloatingButton';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import ConfirmModal from '../components/ConfirmModal';
import { useTasks } from '../context/TaskContext';
import { useOccurrences } from '../hooks/useOccurrences';
import { getXPFromPriority } from '../utils/xp';
import { useXP } from '../context/XPContext';
import AppBackground from '../components/AppBackground';
import Animated, { FadeIn } from 'react-native-reanimated';


export default function DemnaechstScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [pendingIndex, setPendingIndex] = useState(null);
    const [selectedOcc, setSelectedOcc] = useState(null);
    const [loadedCount, setLoadedCount] = useState(7);
    const [loadingMore, setLoadingMore] = useState(false);

    const { tasks, addTask, checkTask, deleteTask, updateTask } = useTasks();

    const [pendingTask, setPendingTask] = useState(null);
    const { addXP } = useXP();

    // alle Vorkommnisse im nächsten Jahr
    const allOcc = useOccurrences(tasks, 365);
    const occ = allOcc.slice(0, loadedCount);
    const canMore = loadedCount < allOcc.length;

    // gruppieren wie gehabt
    const sections = useMemo(() => {
        const map = {};
        occ.forEach(({ original: task, date, key }) => {
            const m = date.toLocaleDateString('de-DE', { year: 'numeric', month: 'long' });
            const d = date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
            if (!map[m]) map[m] = {};
            if (!map[m][d]) map[m][d] = [];
            map[m][d].push({ task, date, key });
        });
        return Object.entries(map)
            .sort(([a], [b]) => new Date(`${a} 1`) - new Date(`${b} 1`))
            .map(([month, daysObj]) => ({
                title: month,
                data: Object.entries(daysObj)
                    .sort(([a], [b]) => {
                        const da = new Date(daysObj[a][0].date).setHours(0, 0, 0, 0);
                        const db = new Date(daysObj[b][0].date).setHours(0, 0, 0, 0);
                        return da - db;
                    })
                    .map(([day, items]) => ({
                        day,
                        items: items.sort((x, y) => x.date - y.date)
                    }))
            }));
    }, [occ]);

    const now = new Date();
    const getPriorityColor = p => ({
        '1': '#EDE7F6', '2': '#D1C4E9', '3': '#B39DDB',
        '4': '#9575CD', '5': '#7E57C2'
    })[p] || '#EDE7F6';
    const getRecurrenceIcon = r => r === 'Einmalig' ? 'calendar-outline' : 'repeat';
    const getPriorityBackground = (p) => ({
        '1': '#EDE7F6',
        '2': '#D1C4E9',
        '3': '#B39DDB',
        '4': '#9575CD',
        '5': '#7E57C2',
    }[p] || '#B39DDB');


    const getTextColor = (p) => {
        switch (p) {
            case '1': return '#222'; // dunkel auf hellem Hintergrund
            case '2': return '#333';
            case '3': return '#fff';
            case '4': return '#fff';
            case '5': return '#eee'; // hell auf dunklem Hintergrund
            default: return '#fff';
        }
    };


    // Klick auf den Radiobutton
    const onRadioPress = (task, taskIdx, date, done) => {
        if (done) return;
        const isOverdue = date < now;
        if (!isOverdue) {
            setPendingIndex(taskIdx);
            setPendingTask(task);
            setConfirmVisible(true);
        } else {
            // überfällige Aufgaben direkt abhaken, aber ohne XP
            doCheck(taskIdx, false);
        }
    };

    // tatsächliches Abhaken + XP-Log
    const doCheck = async (idx, withXP = true) => {
        await checkTask(idx);
        if (withXP && pendingTask) {
            // nur hier lesen wir die Prio aus pendingTask
            const xp = getXPFromPriority(pendingTask.priority);
            addXP(xp);
            console.log("Prio: ", pendingTask.priority);
            console.log(`Gewonnene XP: ${getXPFromPriority(pendingTask.priority)}`);
            console.log(`Gewonnen2 XP: ${xp}`);
        }
        setConfirmVisible(false);
        setPendingIndex(null);
        setPendingTask(null);
    };

    const handleEndReached = () => {
        if (!canMore || loadingMore) return;
        setLoadingMore(true);
        setLoadedCount(c => c + 7);
    };

    React.useEffect(() => {
        if (loadingMore) setLoadingMore(false);
    }, [occ]);

    const renderDay = ({ item }) => (
        <View>
            <Text style={styles.dayHeader}>{item.day}</Text>
            {item.items.map(({ task, date, key }) => {
                const idx = tasks.indexOf(task);
                const isDone = !!task.done;
                const doneAt = task.doneAt ? new Date(task.doneAt) : null;
                const isOverdue = date < now && !isDone;
                let borderColor = 'transparent';
                if (isDone && doneAt > date) borderColor = 'yellow';
                else if (isDone) borderColor = 'green';
                else if (isOverdue) borderColor = 'red';

                const timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                    <Animated.View key={key} entering={FadeIn.duration(400)}>
                        <TouchableOpacity
                            key={key}
                            style={[
                                styles.taskBox,
                                {
                                    backgroundColor: getPriorityBackground(task.priority),
                                    borderColor,
                                    borderWidth: borderColor === 'transparent' ? 0 : 2,
                                }
                            ]}
                            onPress={() => setSelectedOcc({ task, date })}
                        >
                            <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => onRadioPress(task, idx, date, isDone)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                {isDone && <Ionicons name="checkmark" size={20} color="#7E57C2" />}
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
                                    style={{ marginHorizontal: 6 }}
                                />

                                <Text style={[styles.timeLabel, { color: getTextColor(task.priority) }]}>
                                    {timeLabel}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                );
            })}
        </View>
    );

    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <AppBackground style={styles.container}>
                <SectionList
                    sections={sections}
                    keyExtractor={item => item.items[0].key}
                    renderSectionHeader={({ section }) => (
                        <Text style={styles.monthHeader}>{section.title}</Text>
                    )}
                    renderItem={renderDay}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() =>
                        loadingMore ? <ActivityIndicator style={{ margin: 20 }} /> : null
                    }
                />

                <FloatingButton onPress={() => setModalVisible(true)} />

                <AddTaskModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSubmit={addTask}
                />

                <TaskDetailModal
                    visible={!!selectedOcc}
                    task={selectedOcc?.task}
                    occurrenceDate={selectedOcc?.date}
                    onClose={() => setSelectedOcc(null)}
                    onDelete={() => { deleteTask(selectedOcc.task); setSelectedOcc(null); }}
                    onUpdate={upd => { updateTask({ original: selectedOcc.task, newData: upd }); setSelectedOcc(null); }}
                />

                <ConfirmModal
                    visible={confirmVisible}
                    message="Bist du sicher, dass du diese Aufgabe abhaken möchtest?"
                    onCancel={() => { setConfirmVisible(false); setPendingIndex(null); }}
                    onConfirm={() => doCheck(pendingIndex, true)}
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
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingBottom: 100,
    },
    monthHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#C7AFFF',
        marginTop: 20,
        marginLeft: 16,
        marginBottom: 4,
    },
    dayHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: '#B39DDB',
        marginLeft: 20,
        marginVertical: 5,
    },
    taskBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.07)',
        padding: 16,
        borderRadius: 14,
        marginHorizontal: 16,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
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
    },
    separator: {
        width: 1,
        height: 24,
        backgroundColor: '#9575CD',
        marginHorizontal: 12,
    },
    titleRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    taskTitle: {
        fontSize: 16,
        color: '#fff',
        flex: 1,
        fontWeight: '500',
    },
    timeLabel: {
        marginLeft: 8,
        fontSize: 13,
        color: '#CCC',
    },
});
