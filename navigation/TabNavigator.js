import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import DemnaechstScreen from '../screens/DemnaechstScreen';
import MenuScreen from '../screens/MenuScreen';
import SucheScreen from '../screens/SucheScreen';
import StatistikScreen from '../screens/StatistikScreen';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <View style={styles.background}>
            <Tab.Navigator
                initialRouteName="Menu"
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#1F1B2E', // dunkles Violett
                        borderTopWidth: 0,
                    },
                    tabBarActiveTintColor: '#FFD54F',
                    tabBarInactiveTintColor: 'gray',
                    tabBarLabelStyle: { paddingBottom: 4 },
                    tabBarIcon: ({ color, size }) => {
                        switch (route.name) {
                            case 'Demnächst':
                                return <MaterialIcons name="event" size={size} color={color} />;
                            case 'Menu':
                                return <Feather name="circle" size={size} color={color} />;
                            case 'Suche':
                                return <Feather name="search" size={size} color={color} />;
                            case 'Statistik':
                                return <Ionicons name="stats-chart" size={size} color={color} />;
                            default:
                                return null;
                        }
                    },
                })}
            >
                <Tab.Screen name="Demnächst" component={DemnaechstScreen} />
                <Tab.Screen name="Menu" component={MenuScreen} />
                <Tab.Screen name="Suche" component={SucheScreen} />
                <Tab.Screen name="Statistik" component={StatistikScreen} />
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#121212', // kompletter Screen-Hintergrund
    },
});
