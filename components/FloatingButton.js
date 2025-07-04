import React from 'react';
import { TouchableOpacity, StyleSheet, View, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FloatingButton({ onPress }) {
    const scale = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={[styles.shadowContainer, { transform: [{ scale }] }]}>
            <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
                activeOpacity={0.9}
                style={styles.fab}
            >
                <Ionicons name="add" size={32} color="#fff" />
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    shadowContainer: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        shadowColor: '#7E57C2',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 12,
    },
    fab: {
        backgroundColor: '#7E57C2',
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
