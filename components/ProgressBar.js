import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ProgressBar({ progress }) {
    return (
        <View style={styles.container}>
            <View style={[styles.filler, { width: `${progress * 100}%` }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        height: 20,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    filler: {
        height: '100%',
        backgroundColor: '#7E57C2',
    },
});
