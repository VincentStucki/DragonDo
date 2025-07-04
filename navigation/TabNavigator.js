import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import DemnaechstScreen from '../screens/DemnaechstScreen';
import MenuScreen from '../screens/MenuScreen';
import SucheScreen from '../screens/SucheScreen';
import StatistikScreen from '../screens/StatistikScreen';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';

const initialLayout = { width: Dimensions.get('window').width };

export default function BottomSwipeNavigator() {
    const [index, setIndex] = React.useState(1);

    const [routes] = React.useState([
        { key: 'demnaechst', title: 'Demnächst', icon: <MaterialIcons name="event" size={24} color="#fff" /> },
        { key: 'menu', title: 'Menu', icon: <Ionicons name="flame" size={24} color="#fff" /> },
        { key: 'suche', title: 'Suche', icon: <Feather name="search" size={24} color="#fff" /> },
        { key: 'statistik', title: 'Statistik', icon: <Ionicons name="stats-chart" size={24} color="#fff" /> },
    ]);

    const renderScene = SceneMap({
        demnaechst: DemnaechstScreen,
        menu: MenuScreen,
        suche: SucheScreen,
        statistik: StatistikScreen,
    });

    const renderTabBar = () => (
        <View style={styles.tabBar}>
            {routes.map((route, i) => (
                <TouchableOpacity
                    key={route.key}
                    style={styles.tabItem}
                    onPress={() => setIndex(i)}
                >
                    {React.cloneElement(route.icon, {
                        color: index === i ? '#FFD54F' : 'gray',
                    })}
                    <Text style={{ color: index === i ? '#FFD54F' : 'gray', fontSize: 12 }}>{route.title}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={() => null} // keine obere Tabbar
            />
            {renderTabBar()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        backgroundColor: '#1F1B2E',
        borderTopWidth: 0,
        height: 80,
    },
    tabItem: {
        alignItems: 'center',
        flex: 1,
    },
});
