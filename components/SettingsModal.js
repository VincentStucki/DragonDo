import React, { useState } from 'react';
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
    Keyboard
} from 'react-native';

export default function SettingsModal({ visible, onClose, currentName, onSave }) {
    const [name, setName] = useState(currentName);

    const handleSave = () => {
        onSave(name);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.modalContentWrapper}
                        >
                            <View style={styles.modalContent}>
                                <Text style={styles.label}>Name des Drachenei's:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Gib einen Namen ein"
                                />
                                <TouchableOpacity style={styles.button} onPress={handleSave}>
                                    <Text style={styles.buttonText}>Speichern</Text>
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
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContentWrapper: {
        width: '80%',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#7E57C2',
        padding: 12,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
