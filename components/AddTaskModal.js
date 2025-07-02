import React, { useState } from 'react';
import {
    Modal, View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform,
    TouchableWithoutFeedback, Keyboard
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function AddTaskModal({ visible, onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [priority, setPriority] = useState('1');

    const [showPriorityOptions, setShowPriorityOptions] = useState(false);


    const handleSubmit = () => {
        onSubmit({ title, desc, date: date.toString(), priority });
        onClose();
        setTitle('');
        setDesc('');
        setDate(new Date());
        setPriority('1');
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.container}
                        >
                            <View style={styles.content}>
                                <Text style={styles.label}>Titel</Text>
                                <TextInput
                                    style={styles.input}
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="Titel eingeben"
                                    autoFocus
                                />

                                <Text style={styles.label}>Beschreibung</Text>
                                <TextInput
                                    style={styles.input}
                                    value={desc}
                                    onChangeText={setDesc}
                                    placeholder="Beschreibung"
                                />

                                <Text style={styles.label}>Zeitpunkt</Text>
                                <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
                                    <Text>{date.toLocaleString()}</Text>
                                </TouchableOpacity>
                                {showPicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="datetime"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            const currentDate = selectedDate || date;
                                            setShowPicker(false);
                                            setDate(currentDate);
                                        }}
                                    />
                                )}

                                <Text style={styles.label}>Priorität</Text>
                                <TouchableOpacity
                                    style={styles.dropdown}
                                    onPress={() => setShowPriorityOptions(!showPriorityOptions)}
                                >
                                    <Text>{`Priorität ${priority}`}</Text>
                                </TouchableOpacity>
                                {showPriorityOptions && (
                                    <View style={styles.dropdownOptions}>
                                        {[1, 2, 3, 4, 5].map((p) => (
                                            <TouchableOpacity
                                                key={p}
                                                style={styles.option}
                                                onPress={() => {
                                                    setPriority(p.toString());
                                                    setShowPriorityOptions(false);
                                                }}
                                            >
                                                <Text>{`Priorität ${p}`}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                    <Text style={styles.buttonText}>Hinzufügen</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    container: {
        width: '100%',
    },
    content: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    label: {
        marginTop: 10,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginTop: 5,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginTop: 5,
        overflow: 'hidden',
    },
    button: {
        backgroundColor: '#7E57C2',
        padding: 12,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginTop: 5,
        backgroundColor: '#fff',
    },
    dropdownOptions: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginTop: 5,
        overflow: 'hidden',
    },
    option: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

});
