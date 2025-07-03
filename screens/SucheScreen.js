import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FloatingButton from '../components/FloatingButton';
import AddTaskModal from '../components/AddTaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import { useTasks } from '../context/TaskContext';

export default function SucheScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchText, setSearchText] = useState('');
    const { tasks, addTask, toggleDone, deleteTask, updateTask } = useTasks();

    const getPriorityColor = (priority) => {
        const colors = {
            '1': '#EDE7F6',
            '2': '#D1C4E9',
            '3': '#B39DDB',
            '4': '#9575CD',
            '5': '#7E57C2'
        };
        return colors[priority] || '#EDE7F6';
    };

    const getRecurrenceIcon = (rec) => {
        return rec === 'Einmalig' ? 'calendar-outline' : 'repeat';
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Suche nach Titel..."
                value={searchText}
                onChangeText={setSearchText}
            />

            <ScrollView style={styles.taskList}>
                {filteredTasks.map((task, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => setSelectedTask(task)}
                        style={[styles.taskBox, { backgroundColor: getPriorityColor(task.priority) }]}
                    >
                        <TouchableOpacity
                            onPress={() => toggleDone(i)}
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
                                size={18}
                                color="#7E57C2"
                                style={{ marginLeft: 8 }}
                            />
                        </View>
                    </TouchableOpacity>
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
                onDelete={() => {
                    deleteTask(selectedTask);
                    setSelectedTask(null);
                }}
                onUpdate={(updated) => {
                    updateTask({ original: selectedTask, newData: updated });
                    setSelectedTask(null);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingBottom: 90 },
    searchInput: {
        borderWidth: 1, borderColor: '#ccc',
        borderRadius: 10, padding: 10, marginBottom: 15,
        backgroundColor: '#fff'
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
        width: 1, height: 24, backgroundColor: '#7E57C2', marginRight: 12
    },
    titleRow: {
        flexDirection: 'row', alignItems: 'center'
    },
    taskTitle: { fontSize: 16, color: '#333' }
});
