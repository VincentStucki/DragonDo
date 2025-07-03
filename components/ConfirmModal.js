import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';

export default function ConfirmModal({ visible, message, onConfirm, onCancel }) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.box}>
                            <Text style={styles.text}>{message}</Text>
                            <View style={styles.row}>
                                <TouchableOpacity style={styles.btn} onPress={onCancel}>
                                    <Text style={styles.btnText}>Abbrechen</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn, styles.confirm]} onPress={onConfirm}>
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
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20
    },
    text: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btn: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#ccc',
        marginHorizontal: 5
    },
    confirm: {
        backgroundColor: '#7E57C2'
    },
    btnText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold'
    }
});
