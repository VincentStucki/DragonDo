// screens/MenuScreen.js
import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, StyleSheet, TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from '../components/ProgressBar';
import SettingsModal from '../components/SettingsModal';
import { useXP, XP_THRESHOLDS, EVOLUTION_STAGES } from '../context/XPContext';

export default function MenuScreen() {
    const [name, setName] = useState('Name');
    const [modalVisible, setModalVisible] = useState(false);
    const { xp } = useXP();

    useEffect(() => {
        AsyncStorage.getItem('eggName').then(v => {
            if (v) setName(v);
        });
    }, []);

    const handleSaveName = async (newName) => {
        setName(newName);
        await AsyncStorage.setItem('eggName', newName);
    };

    // aktuelle Stufe bestimmen
    let stage = 0;
    for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= XP_THRESHOLDS[i]) {
            stage = i;
            break;
        }
    }
    const curr = XP_THRESHOLDS[stage];
    const next = XP_THRESHOLDS[stage + 1] ?? curr;
    const progress = next > curr ? (xp - curr) / (next - curr) : 1;

    const evoImage = {
        dragonegg: require('../assets/dragonegg.png'),
        babydragon: require('../assets/babydragon.png'),
        teendragon: require('../assets/teendragon.png'),
        adultdragon: require('../assets/adultdragon.png'),
        legendarydragon: require('../assets/legendarydragon.png'),
    }[EVOLUTION_STAGES[stage]];

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="settings-outline" size={28} color="#333" />
            </TouchableOpacity>

            <Text style={styles.title}>{name}</Text>
            <Image source={evoImage} style={styles.egg} resizeMode="contain" />
            <ProgressBar progress={progress} />

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
        position: 'absolute', top: 50, right: 20, zIndex: 10
    },
    title: {
        fontSize: 28, fontWeight: 'bold', marginBottom: 20
    },
    egg: {
        width: 150, height: 150, marginBottom: 30
    }
});
