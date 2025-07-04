import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing
} from 'react-native-reanimated';

const BAR_WIDTH = Dimensions.get('window').width * 0.8;
const BAR_HEIGHT = 20;

export default function ProgressBar({ progress }) {
    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        animatedProgress.value = withTiming(progress, {
            duration: 800,
            easing: Easing.out(Easing.ease)
        });
    }, [progress]);

    const fillerStyle = useAnimatedStyle(() => ({
        width: animatedProgress.value * BAR_WIDTH,
    }));

    const bubbleStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: animatedProgress.value * BAR_WIDTH - 12 }],
        opacity: progress === 0 ? 0 : 1
    }));

    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                <Animated.View style={[styles.filler, fillerStyle]} />
            </View>
            <Animated.View style={[styles.bubble, bubbleStyle]}>
                <Text style={styles.bubbleText}>{Math.round(progress * 100)}%</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: BAR_WIDTH,
        height: BAR_HEIGHT + 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    bar: {
        width: BAR_WIDTH,
        height: BAR_HEIGHT,
        backgroundColor: '#3D2D78',
        borderRadius: 12,
        overflow: 'hidden',
    },
    filler: {
        height: '100%',
        backgroundColor: '#B388FF',
        borderRadius: 12,
        shadowColor: '#B388FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 8,
    },
    bubble: {
        position: 'absolute',
        top: -30,
        backgroundColor: '#7E57C2',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        shadowColor: '#7E57C2',
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
    },
    bubbleText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
