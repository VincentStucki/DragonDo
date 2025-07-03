import React, { useState, useEffect } from 'react';
import {
    Modal, View, Text, StyleSheet, TouchableOpacity,
    KeyboardAvoidingView, Platform, TextInput,
    TouchableWithoutFeedback, Keyboard
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const RECURRENCE_OPTIONS = ['Einmalig', 'Täglich', 'Wöchentlich', 'Monatlich', 'Jährlich'];

export default function TaskDetailModal({ visible, task, onClose, onDelete, onUpdate }) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [priority, setPriority] = useState('1');

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [recurrence, setRecurrence] = useState('Einmalig');
    const [showRecurrenceOptions, setShowRecurrenceOptions] = useState(false);
    const [showPriorityOptions, setShowPriorityOptions] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDesc(task.desc || '');
            setPriority(task.priority || '1');
            const dt = new Date(task.date);
            setDate(dt); setTime(dt);
            setRecurrence(task.recurrence || 'Einmalig');
            setShowPriorityOptions(false);
            setShowRecurrenceOptions(false);
        }
    }, [task]);

    const handleUpdate = () => {
        const dt = new Date(
            date.getFullYear(), date.getMonth(), date.getDate(),
            time.getHours(), time.getMinutes()
        );
        onUpdate({ ...task, title, desc, date: dt.toString(), priority, recurrence });
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.container}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.content}>
                                <Text style={styles.header}>Task bearbeiten</Text>

                                <Text style={styles.label}>Titel</Text>
                                <TextInput style={styles.input} value={title} onChangeText={setTitle} />

                                <Text style={styles.label}>Beschreibung</Text>
                                <TextInput style={styles.input} value={desc} onChangeText={setDesc} />

                                <View style={styles.row}>
                                    <View style={styles.flex}>
                                        <Text style={styles.label}>Datum</Text>
                                        <TouchableOpacity
                                            style={styles.input}
                                            onPress={() => setShowDatePicker(true)}
                                        >
                                            <Text>{date.toLocaleDateString()}</Text>
                                        </TouchableOpacity>
                                        {showDatePicker && (
                                            <DateTimePicker
                                                value={date}
                                                mode="date"
                                                display="default"
                                                onChange={(_, sel) => {
                                                    setShowDatePicker(false);
                                                    if (sel) setDate(sel);
                                                }}
                                            />
                                        )}
                                    </View>
                                    <View style={styles.flex}>
                                        <Text style={styles.label}>Uhrzeit</Text>
                                        <TouchableOpacity
                                            style={styles.input}
                                            onPress={() => setShowTimePicker(true)}
                                        >
                                            <Text>
                                                {time.getHours().toString().padStart(2, '0')}:
                                                {time.getMinutes().toString().padStart(2, '0')}
                                            </Text>
                                        </TouchableOpacity>
                                        {showTimePicker && (
                                            <DateTimePicker
                                                value={time}
                                                mode="time"
                                                display="default"
                                                onChange={(_, sel) => {
                                                    setShowTimePicker(false);
                                                    if (sel) setTime(sel);
                                                }}
                                            />
                                        )}
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <View style={styles.flex}>
                                        <Text style={styles.label}>Priorität</Text>
                                        <TouchableOpacity
                                            style={styles.dropdown}
                                            onPress={() => setShowPriorityOptions(v => !v)}
                                        >
                                            <Text>{`Priorität ${priority}`}</Text>
                                        </TouchableOpacity>
                                        {showPriorityOptions && (
                                            <View style={styles.dropdownOptions}>
                                                {[1, 2, 3, 4, 5].map(p => (
                                                    <TouchableOpacity
                                                        key={p}
                                                        style={styles.option}
                                                        onPress={() => { setPriority(String(p)); setShowPriorityOptions(false); }}
                                                    >
                                                        <Text>{`Priorität ${p}`}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.flex}>
                                        <Text style={styles.label}>Wiederholung</Text>
                                        <TouchableOpacity
                                            style={styles.dropdown}
                                            onPress={() => setShowRecurrenceOptions(v => !v)}
                                        >
                                            <Text>{recurrence}</Text>
                                        </TouchableOpacity>
                                        {showRecurrenceOptions && (
                                            <View style={styles.dropdownOptions}>
                                                {RECURRENCE_OPTIONS.map(opt => (
                                                    <TouchableOpacity
                                                        key={opt}
                                                        style={styles.option}
                                                        onPress={() => { setRecurrence(opt); setShowRecurrenceOptions(false); }}
                                                    >
                                                        <Text>{opt}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={styles.deleteBtn}
                                        onPress={() => { onDelete(task); onClose(); }}
                                    >
                                        <Text style={styles.btnText}>Löschen</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                                        <Text style={styles.btnText}>Speichern</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
    container: { width: '100%' },
    content: {
        backgroundColor: '#fff', padding: 20,
        borderTopLeftRadius: 20, borderTopRightRadius: 20
    },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    label: { marginTop: 10, fontWeight: 'bold' },
    input: {
        borderWidth: 1, borderColor: '#ccc',
        borderRadius: 8, padding: 10, marginTop: 5
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
    flex: { flex: 1, marginRight: 10 },
    dropdown: {
        borderWidth: 1, borderColor: '#ccc',
        borderRadius: 8, padding: 10, backgroundColor: '#fff'
    },
    dropdownOptions: {
        borderWidth: 1, borderColor: '#ccc',
        borderRadius: 8, backgroundColor: '#fff',
        marginTop: 5, overflow: 'hidden'
    },
    option: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    deleteBtn: { backgroundColor: '#e53935', flex: 1, marginRight: 10, padding: 12, borderRadius: 8 },
    saveBtn: { backgroundColor: '#7E57C2', flex: 1, marginLeft: 10, padding: 12, borderRadius: 8 },
    btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});
