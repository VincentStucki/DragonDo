import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DemnaechstScreen from '../screens/DemnaechstScreen';
import MenuScreen from '../screens/MenuScreen';
import SucheScreen from '../screens/SucheScreen';
import StatistikScreen from '../screens/StatistikScreen';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Menu"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    switch (route.name) {
                        case 'Demnaechst':
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
                tabBarActiveTintColor: '#7E57C2',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Demnaechst" component={DemnaechstScreen} />
            <Tab.Screen name="Menu" component={MenuScreen} />
            <Tab.Screen name="Suche" component={SucheScreen} />
            <Tab.Screen name="Statistik" component={StatistikScreen} />
        </Tab.Navigator>
    );
}
