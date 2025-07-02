import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from '../components/ProgressBar';
import SettingsModal from '../components/SettingsModal';

export default function MenuScreen() {
    const [name, setName] = useState('Name');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const loadName = async () => {
            const storedName = await AsyncStorage.getItem('eggName');
            if (storedName) setName(storedName);
        };
        loadName();
    }, []);

    const handleSaveName = async (newName) => {
        setName(newName);
        await AsyncStorage.setItem('eggName', newName);
    };

    return (
        <View style={styles.container}>
            {/* Settings Icon */}
            <TouchableOpacity style={styles.settingsButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="settings-outline" size={28} color="#333" />
            </TouchableOpacity>

            {/* Name Display */}
            <Text style={styles.title}>{name}</Text>

            {/* Egg Image */}
            <Image
                source={require('../assets/dragonegg.png')}
                style={styles.egg}
                resizeMode="contain"
            />

            {/* Progress Bar */}
            <ProgressBar progress={0.2} />

            {/* Modal for Name Change */}
            <SettingsModal
                visible={modalVisible}
                currentName={name}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveName}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20
    },
    settingsButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    title: {
        fontSize: 28, fontWeight: 'bold', marginBottom: 20
    },
    egg: {
        width: 150, height: 150, marginBottom: 30
    },
});
