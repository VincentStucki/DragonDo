// TabWrapper.js
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import TabNavigator from './TabNavigator';

export default function TabWrapper() {
    return (
        <ImageBackground
            source={require('../assets/smallbg.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <TabNavigator />
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
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0)', // optional halbtransparent
    },
});
