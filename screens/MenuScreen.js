import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from '../components/ProgressBar';
import SettingsModal from '../components/SettingsModal';
import { useXP, XP_THRESHOLDS, EVOLUTION_STAGES } from '../context/XPContext';
import { useTasks } from '../context/TaskContext';

export default function MenuScreen() {
    const [name, setName] = useState('Name');
    const [modalVisible, setModalVisible] = useState(false);
    const [showGif, setShowGif] = useState(false);

    const { xp } = useXP();
    const { tasks } = useTasks();

    useEffect(() => {
        AsyncStorage.getItem('eggName').then(v => {
            if (v) setName(v);
        });
    }, []);

    const handleSaveName = async (newName) => {
        setName(newName);
        await AsyncStorage.setItem('eggName', newName);
    };

    // Entwicklungsstufe berechnen
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
    const currentStage = EVOLUTION_STAGES[stage];

    // GIF nur bei dragonegg zeigen
    useEffect(() => {
        if (currentStage === 'dragonegg') {
            setShowGif(true);
            const timer = setTimeout(() => setShowGif(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [currentStage]);

    // Bilder definieren
    const evoImage = {
        dragonegg: require('../assets/dragonegg.png'),
        babydragon: require('../assets/babydragon.png'),
        teendragon: require('../assets/teendragon.png'),
        adultdragon: require('../assets/adultdragon.png'),
        legendarydragon: require('../assets/legendarydragon.png'),
    }[currentStage];

    const evoImageSize = {
        dragonegg: { width: 200, height: 200 },
        babydragon: { width: 220, height: 220 },
        teendragon: { width: 250, height: 250 },
        adultdragon: { width: 270, height: 270 },
        legendarydragon: { width: 280, height: 280 },
    }[currentStage];

    const upcomingTask = tasks
        .filter(task => !task.done && new Date(task.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Ionicons name="settings-outline" size={28} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.title}>{name}</Text>

                {/* Hier kommt das Ei oder das GIF */}
                {showGif && currentStage === 'dragonegg' ? (
                    <Image
                        source={require('../assets/egg_intro.gif')}
                        style={[styles.egg, styles.gif]}
                        resizeMode="contain"
                    />
                ) : (
                    <Image
                        source={evoImage}
                        style={[styles.egg, evoImageSize]}
                        resizeMode="contain"
                    />
                )}

                <ProgressBar progress={progress} />

                <View style={styles.taskPreview}>
                    <Text style={styles.taskLabel}>Nächste Aufgabe:</Text>
                    {upcomingTask ? (
                        <>
                            <Text style={styles.taskTitle}>{upcomingTask.title}</Text>
                            <Text style={styles.taskDate}>
                                {new Date(upcomingTask.date).toLocaleString('de-DE', {
                                    weekday: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: '2-digit',
                                })}
                            </Text>
                        </>
                    ) : (
                        <Text style={styles.taskTitle}>Keine offenen Aufgaben 🎉</Text>
                    )}
                </View>

                <SettingsModal
                    visible={modalVisible}
                    currentName={name}
                    onClose={() => setModalVisible(false)}
                    onSave={handleSaveName}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    settingsButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    egg: {
        marginBottom: 30,
    },
    gif: {
        width: 200,
        height: 200,
    },
    taskPreview: {
        marginTop: 30,
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        padding: 16,
        borderRadius: 12,
        width: '100%',
    },
    taskLabel: {
        fontSize: 16,
        color: '#bbb',
        marginBottom: 6,
    },
    taskTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    taskDate: {
        fontSize: 14,
        color: '#ccc',
        marginTop: 4,
        textAlign: 'center',
    },
});
