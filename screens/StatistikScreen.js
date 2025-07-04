import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import AppBackground from '../components/AppBackground';

export default function StatistikScreen() {
    return (
        <ImageBackground source={require('../assets/background.png')} style={styles.background} resizeMode="cover">
            <AppBackground style={styles.container}>
                <Text>Statistik</Text>
            </AppBackground>
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
        flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)',
    }
});
