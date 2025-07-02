import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import FloatingButton from '../components/FloatingButton';
import AddTaskModal from '../components/AddTaskModal';
import { Ionicons } from '@expo/vector-icons';

export default function SucheScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [tasks, setTasks] = useState([]);

    const handleAddTask = (task) => {
        setTasks([...tasks, { ...task, done: false }]);
    };

    const toggleDone = (index) => {
        const updated = [...tasks];
        updated[index].done = !updated[index].done;
        setTasks(updated);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.taskList}>
                {tasks.map((task, index) => (
                    <View key={index} style={styles.taskBox}>
                        <TouchableOpacity onPress={() => toggleDone(index)} style={styles.radioButton}>
                            {task.done && <Ionicons name="checkmark" size={18} color="#fff" />}
                        </TouchableOpacity>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                    </View>
                ))}
            </ScrollView>

            <FloatingButton onPress={() => setModalVisible(true)} />

            <AddTaskModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleAddTask}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingBottom: 90,
    },
    taskList: {
        flex: 1,
    },
    taskBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eee',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#7E57C2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    taskTitle: {
        fontSize: 16,
    },
});
