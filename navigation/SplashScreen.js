import React, { useEffect } from 'react';
import { Image, View, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        // Weiter zur App nach 2 Sekunden
        const timer = setTimeout(() => {
            navigation.replace('Home'); // oder deine Hauptkomponente
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require('./assets/logo.png')} style={styles.logo} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // oder deine Hintergrundfarbe
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
});

export default SplashScreen;
