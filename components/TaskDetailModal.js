import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';

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


    const [isReady, setIsReady] = useState(false);

    const [internalVisible, setInternalVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);


    useEffect(() => {
        if (visible) {
            setShouldRender(true);              // Inhalt rendern
            setTimeout(() => setInternalVisible(true), 10); // kurze Verzögerung für saubere Animation
        } else {
            setInternalVisible(false);          // Modal schließen (=> Triggert Exit-Animation)
        }
    }, [visible]);

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDesc(task.desc || '');
            setPriority(task.priority || '1');
            const dt = new Date(task.date);
            setDate(dt); setTime(dt);
            setRecurrence(task.recurrence || 'Einmalig');
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
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection="down"
            animationIn="slideInUp"
            animationOut="slideOutDown"
            onModalHide={() => setShouldRender(false)}
            useNativeDriver={false}
            style={styles.modal}
        >
            {shouldRender && (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.container}>
                            <View style={styles.dragHandle} />

                            <Text style={styles.title}>Task bearbeiten</Text>

                            <Text style={styles.label}>Titel</Text>
                            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Titel" placeholderTextColor="#aaa" />

                            <Text style={styles.label}>Beschreibung</Text>
                            <TextInput style={styles.input} value={desc} onChangeText={setDesc} placeholder="Beschreibung" placeholderTextColor="#aaa" />

                            <View style={styles.row}>
                                <View style={styles.flex}>
                                    <Text style={styles.label}>Datum</Text>
                                    <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                                        <Text style={styles.textLight}>{date.toLocaleDateString()}</Text>
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
                                    <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                                        <Text style={styles.textLight}>
                                            {time.getHours().toString().padStart(2, '0')}:{time.getMinutes().toString().padStart(2, '0')}
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
                                    <TouchableOpacity style={styles.dropdown} onPress={() => setShowPriorityOptions(v => !v)}>
                                        <Text style={styles.textLight}>{`Priorität ${priority}`}</Text>
                                    </TouchableOpacity>
                                    {showPriorityOptions && (
                                        <View style={styles.dropdownOptions}>
                                            {[1, 2, 3, 4, 5].map(p => (
                                                <TouchableOpacity key={p} style={styles.option} onPress={() => {
                                                    setPriority(String(p)); setShowPriorityOptions(false);
                                                }}>
                                                    <Text style={styles.textLight}>{`Priorität ${p}`}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>

                                <View style={styles.flex}>
                                    <Text style={styles.label}>Wiederholung</Text>
                                    <TouchableOpacity style={styles.dropdown} onPress={() => setShowRecurrenceOptions(v => !v)}>
                                        <Text style={styles.textLight}>{recurrence}</Text>
                                    </TouchableOpacity>
                                    {showRecurrenceOptions && (
                                        <View style={styles.dropdownOptions}>
                                            {RECURRENCE_OPTIONS.map(opt => (
                                                <TouchableOpacity key={opt} style={styles.option} onPress={() => {
                                                    setRecurrence(opt); setShowRecurrenceOptions(false);
                                                }}>
                                                    <Text style={styles.textLight}>{opt}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.deleteBtn} onPress={() => { onDelete(task); onClose(); }}>
                                    <Text style={styles.btnText}>Löschen</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                                    <Text style={styles.btnText}>Speichern</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            )}
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: { justifyContent: 'flex-end', margin: 0 },
    keyboardView: { width: '100%' },
    container: {
        backgroundColor: '#1F1B2E',
        padding: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#888',
        alignSelf: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontWeight: '600',
        color: '#EDE7F6',
        marginTop: 10,
    },
    input: {
        backgroundColor: '#2A2540',
        borderRadius: 10,
        padding: 12,
        marginTop: 6,
        color: '#fff',
    },
    textLight: { color: '#fff' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
    flex: { flex: 1, marginRight: 10 },
    dropdown: {
        backgroundColor: '#2A2540',
        borderRadius: 10,
        padding: 12,
        marginTop: 6,
    },
    dropdownOptions: {
        backgroundColor: '#2A2540',
        borderRadius: 10,
        marginTop: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#3D2D78',
    },
    option: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#3D2D78',
    },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
    deleteBtn: {
        backgroundColor: '#E53935',
        flex: 1,
        marginRight: 10,
        padding: 14,
        borderRadius: 10,
    },
    saveBtn: {
        backgroundColor: '#7E57C2',
        flex: 1,
        marginLeft: 10,
        padding: 14,
        borderRadius: 10,
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
});
