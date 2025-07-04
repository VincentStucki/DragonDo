import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput,
    TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform,
    TouchableWithoutFeedback, Keyboard
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import { scheduleTaskReminder } from '../utils/notificationUtils';


const RECURRENCE_OPTIONS = ['Einmalig', 'Täglich', 'Wöchentlich', 'Monatlich', 'Jährlich'];

export default function AddTaskModal({ visible, onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [priority, setPriority] = useState('1');
    const [showPriorityOptions, setShowPriorityOptions] = useState(false);

    const [recurrence, setRecurrence] = useState('Einmalig');
    const [showRecurrenceOptions, setShowRecurrenceOptions] = useState(false);

    useEffect(() => {
        if (!visible) {
            setTitle(''); setDesc('');
            setDate(new Date()); setTime(new Date());
            setPriority('1'); setRecurrence('Einmalig');
            setShowPriorityOptions(false);
            setShowRecurrenceOptions(false);
        }
    }, [visible]);

    const handleSubmit = async () => {
        const dt = new Date(
            date.getFullYear(), date.getMonth(), date.getDate(),
            time.getHours(), time.getMinutes()
        );

        const newTask = {
            title,
            desc,
            date: dt.toString(),
            priority,
            recurrence
        };

        if (!title.trim()) {
            Alert.alert('Fehler', 'Titel darf nicht leer sein');
            return;
        }


        onSubmit(newTask);
        onClose();
        await scheduleTaskReminder(newTask);
    };

    return (
        <Modal
            isVisible={visible}
            onSwipeComplete={onClose}
            swipeDirection="down"
            onBackdropPress={onClose}
            useNativeDriver={false}
            style={styles.modal}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.content}>
                        <View style={styles.dragHandle} />

                        <Text style={styles.label}>*Titel</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Titel eingeben"
                            placeholderTextColor="#aaa"
                            autoFocus
                        />

                        <Text style={styles.label}>Beschreibung</Text>
                        <TextInput
                            style={styles.input}
                            value={desc}
                            onChangeText={setDesc}
                            placeholder="Beschreibung"
                            placeholderTextColor="#aaa"
                        />

                        <View style={styles.row}>
                            <View style={styles.flex}>
                                <Text style={styles.label}>Datum</Text>
                                <TouchableOpacity
                                    style={styles.input}
                                    onPress={() => setShowDatePicker(true)}
                                >
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
                                <TouchableOpacity
                                    style={styles.input}
                                    onPress={() => setShowTimePicker(true)}
                                >
                                    <Text style={styles.textLight}>
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
                                    <Text style={styles.textLight}>{`Priorität ${priority}`}</Text>
                                </TouchableOpacity>
                                {showPriorityOptions && (
                                    <View style={styles.dropdownOptions}>
                                        {[1, 2, 3, 4, 5].map(p => (
                                            <TouchableOpacity
                                                key={p}
                                                style={styles.option}
                                                onPress={() => { setPriority(String(p)); setShowPriorityOptions(false); }}
                                            >
                                                <Text style={styles.textLight}>{`Priorität ${p}`}</Text>
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
                                    <Text style={styles.textLight}>{recurrence}</Text>
                                </TouchableOpacity>
                                {showRecurrenceOptions && (
                                    <View style={styles.dropdownOptions}>
                                        {RECURRENCE_OPTIONS.map(opt => (
                                            <TouchableOpacity
                                                key={opt}
                                                style={styles.option}
                                                onPress={() => { setRecurrence(opt); setShowRecurrenceOptions(false); }}
                                            >
                                                <Text style={styles.textLight}>{opt}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Hinzufügen</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    container: {
        width: '100%',
    },
    content: {
        backgroundColor: '#1F1B2E',
        padding: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#888',
        alignSelf: 'center',
        marginBottom: 10,
    },
    label: {
        marginTop: 12,
        fontWeight: '600',
        color: '#EDE7F6',
        fontSize: 15,
    },
    input: {
        backgroundColor: '#2A2540',
        borderRadius: 10,
        padding: 12,
        marginTop: 6,
        color: '#fff',
        fontSize: 15,
    },
    textLight: {
        color: '#fff',
        fontSize: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 18,
    },
    flex: {
        flex: 1,
        marginRight: 10,
    },
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
    button: {
        backgroundColor: '#7E57C2',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 24,
        shadowColor: '#7E57C2',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
