// components/AppBackground.js
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppBackground({ children }) {
    return (
        <ImageBackground
            source={require('../assets/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    safe: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)', // optionaler Overlay
        paddingHorizontal: 16,
    },
});
