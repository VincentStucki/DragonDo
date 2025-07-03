import React, { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FloatingButton from '../components/FloatingButton';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import { useTasks } from '../context/TaskContext';

const groupTasksByMonthAndDay = (tasks) => {
    const grouped = {};
    tasks.forEach(task => {
        const d = new Date(task.date);
        const monthKey = d.toLocaleDateString('de-DE', { year: 'numeric', month: 'long' });
        const dayKey = d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
        grouped[monthKey] = grouped[monthKey] || {};
        grouped[monthKey][dayKey] = grouped[monthKey][dayKey] || [];
        grouped[monthKey][dayKey].push({ task, fullDate: d });
    });
    return Object.entries(grouped)
        .sort((a, b) => new Date(`${a[0]} 1`) - new Date(`${b[0]} 1`))
        .map(([month, days]) => [
            month,
            Object.entries(days).sort((a, b) => a[1][0].fullDate - b[1][0].fullDate)
        ]);
};

export default function DemnaechstScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const { tasks, addTask, toggleDone, deleteTask, updateTask } = useTasks();

    const getPriorityColor = (p) => {
        const colors = {
            '1': '#EDE7F6', '2': '#D1C4E9', '3': '#B39DDB',
            '4': '#9575CD', '5': '#7E57C2'
        };
        return colors[p] || '#EDE7F6';
    };

    const grouped = useMemo(() => groupTasksByMonthAndDay(tasks), [tasks]);

    const getRecurrenceIcon = (rec) =>
        rec === 'Einmalig' ? 'calendar-outline' : 'repeat';

    return (
        <View style={styles.container}>
            <ScrollView style={styles.taskList}>
                {grouped.map(([month, days], i) => (
                    <View key={i}>
                        <Text style={styles.monthHeader}>{month}</Text>
                        {days.map(([day, arr], j) => (
                            <View key={j}>
                                <Text style={styles.dayHeader}>{day}</Text>
                                {arr.map(({ task }, k) => (
                                    <TouchableOpacity
                                        key={k}
                                        onPress={() => setSelectedTask(task)}
                                        style={[styles.taskBox, { backgroundColor: getPriorityColor(task.priority) }]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => toggleDone(tasks.indexOf(task))}
                                            style={styles.radioButton}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            {task.done && <Ionicons name="checkmark" size={20} color="#7E57C2" />}
                                        </TouchableOpacity>
                                        <View style={styles.separator} />
                                        <View style={styles.titleRow}>
                                            <Text style={styles.taskTitle}>{task.title}</Text>
                                            <Ionicons
                                                name={getRecurrenceIcon(task.recurrence)}
                                                size={18} color="#7E57C2" style={{ marginLeft: 8 }}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>
                ))}
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
                onDelete={() => { deleteTask(selectedTask); setSelectedTask(null); }}
                onUpdate={(upd) => { updateTask({ original: selectedTask, newData: upd }); setSelectedTask(null); }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingBottom: 90 },
    taskList: { flex: 1 },
    monthHeader: {
        fontSize: 20, fontWeight: 'bold',
        color: '#4527A0', marginTop: 20, marginBottom: 10
    },
    dayHeader: {
        fontSize: 16, fontWeight: '600',
        color: '#7E57C2', marginVertical: 5, marginLeft: 5
    },
    taskBox: {
        flexDirection: 'row', alignItems: 'center',
        padding: 15, borderRadius: 12, marginBottom: 10
    },
    radioButton: {
        width: 28, height: 28, borderRadius: 14,
        borderWidth: 2, borderColor: '#7E57C2',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff', marginRight: 12
    },
    separator: {
        width: 1, height: 24, backgroundColor: '#7E57C2', marginRight: 12
    },
    titleRow: {
        flexDirection: 'row', alignItems: 'center'
    },
    taskTitle: { fontSize: 16, color: '#333' }
});
