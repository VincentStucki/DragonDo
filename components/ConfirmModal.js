import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Vibration,
    Platform
} from 'react-native';
// Fenster für die Bestätigung
export default function ConfirmModal({ visible, message, onConfirm, onCancel }) {
    const handleConfirm = () => {
        if (Platform.OS !== 'web') {
            Vibration.vibrate(5);
        }
        onConfirm();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.box}>
                            <Text style={styles.message}>{message}</Text>
                            <View style={styles.buttons}>
                                <TouchableOpacity
                                    style={[styles.btn, styles.cancelBtn]}
                                    onPress={onCancel}
                                >
                                    <Text style={styles.btnText}>Abbrechen</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.btn, styles.confirmBtn]}
                                    onPress={handleConfirm}
                                >
                                    <Text style={styles.btnText}>Ja</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        width: '85%',
        backgroundColor: '#1F1B2E',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    message: {
        color: '#EDE7F6',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        marginHorizontal: 6,
    },
    cancelBtn: {
        backgroundColor: '#555',
    },
    confirmBtn: {
        backgroundColor: '#7E57C2',
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
});
