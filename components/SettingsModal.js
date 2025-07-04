import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';
import { useTasks } from '../context/TaskContext';
import { useXP } from '../context/XPContext';

export default function SettingsModal({ visible, onClose, currentName, onSave }) {
    const [name, setName] = useState(currentName);
    const { clearAllTasks } = useTasks();
    const { resetXP } = useXP();

    useEffect(() => {
        if (visible) {
            setName(currentName);
        }
    }, [visible, currentName]);

    const handleSave = () => {
        onSave(name);
        onClose();
    };

    const handleClearStorage = async () => {
        try {
            await clearAllTasks();
            Alert.alert('Erfolg', 'Alle Tasks wurden gelöscht.');
            onClose();
        } catch (e) {
            Alert.alert('Fehler', 'Speicher konnte nicht gelöscht werden.');
        }
    };

    const handleClearEverything = async () => {
        try {
            await clearAllTasks();
            await resetXP();
            Alert.alert('Erfolg', 'Alle Tasks und XP wurden zurückgesetzt.');
            onClose();
        } catch (e) {
            Alert.alert('Fehler', 'Zurücksetzen fehlgeschlagen.');
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.modalContentWrapper}
                        >
                            <View style={styles.modalContent}>
                                <Text style={styles.title}>Einstellungen</Text>

                                <Text style={styles.label}>Name deines Drachen-Ei's</Text>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Name eingeben"
                                    placeholderTextColor="#aaa"
                                />

                                <TouchableOpacity style={styles.button} onPress={handleSave}>
                                    <Text style={styles.buttonText}>Speichern</Text>
                                </TouchableOpacity>

                                <View style={styles.divider} />

                                <TouchableOpacity style={styles.clearButton} onPress={handleClearStorage}>
                                    <Text style={styles.clearText}>Nur Tasks löschen</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.clearButton, { backgroundColor: '#B71C1C' }]} onPress={handleClearEverything}>
                                    <Text style={styles.clearText}>Alles zurücksetzen</Text>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContentWrapper: {
        width: '85%',
    },
    modalContent: {
        backgroundColor: '#1F1B2E',
        padding: 24,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 10,
    },
    title: {
        fontSize: 20,
        color: '#EDE7F6',
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        color: '#D1C4E9',
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#2A2540',
        borderRadius: 10,
        padding: 12,
        color: '#fff',
        fontSize: 16,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#7E57C2',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 4,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
    },
    divider: {
        borderBottomWidth: 1,
        borderColor: '#3D2D78',
        marginVertical: 18,
    },
    clearButton: {
        backgroundColor: '#C62828',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 8,
    },
    clearText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },
});
