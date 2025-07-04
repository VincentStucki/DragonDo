import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTasks } from '../context/TaskContext';
import { useXP } from '../context/XPContext';
import { ProgressChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
//Statistik anschauungen
export default function StatistikScreen() {
    const { tasks } = useTasks();
    const { xp } = useXP();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const all = tasks.length;
    const done = tasks.filter(t => t.done).length;

    const todayTasks = tasks.filter(t => {
        const d = new Date(t.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
    });
    const todayDone = todayTasks.filter(t => t.done).length;
    const progressToday = todayTasks.length > 0 ? todayDone / todayTasks.length : 0;

    const xpPerDay = Array(7).fill(0);
    const days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        d.setHours(0, 0, 0, 0);
        return d;
    });

    tasks.forEach(t => {
        if (t.doneAt) {
            const d = new Date(t.doneAt);
            d.setHours(0, 0, 0, 0);
            days.forEach((day, i) => {
                if (d.getTime() === day.getTime()) {
                    const xpFromTask = t.priority ? parseInt(t.priority) * 5 : 5;
                    xpPerDay[i] += xpFromTask;
                }
            });
        }
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
            <Text style={styles.header}>Deine Statistik</Text>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Tages-Fortschritt</Text>
                <ProgressChart
                    data={{
                        labels: ['Erledigt'], // Fortschrittsbeschriftung
                        data: [progressToday],
                    }}
                    width={screenWidth * 0.8}
                    height={180}
                    strokeWidth={16}
                    radius={42}
                    chartConfig={chartConfig}
                    hideLegend={false}
                />
                <View style={styles.progressInfo}>
                    <Text style={styles.progressText}>
                        {`${todayDone} von ${todayTasks.length} Aufgaben heute erledigt`}
                    </Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>XP Verlauf der letzten 7 Tage</Text>
                <LineChart
                    data={{
                        labels: days.map(d => d.toLocaleDateString('de-DE', { weekday: 'short' })),
                        datasets: [{ data: xpPerDay }],
                    }}
                    width={screenWidth * 0.8}
                    height={220}
                    yAxisSuffix=" XP"
                    chartConfig={chartConfig}
                    bezier
                />
            </View>

            <View style={styles.grid}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Alle Aufgaben</Text>
                    <Text style={styles.statValue}>{all}</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Erledigt</Text>
                    <Text style={styles.statValue}>{done}</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Heute fällig</Text>
                    <Text style={styles.statValue}>{todayTasks.length}</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Heute erledigt</Text>
                    <Text style={styles.statValue}>{todayDone}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const chartConfig = {
    backgroundColor: '#2A2540',
    backgroundGradientFrom: '#2A2540',
    backgroundGradientTo: '#2A2540',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: () => '#D1C4E9',
    propsForDots: {
        r: '5',
        strokeWidth: '2',
        stroke: '#9575CD',
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1B2A',
    },
    header: {
        fontSize: 26,
        color: '#EDE7F6',
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#2A2540',
        borderRadius: 16,
        padding: 20,
        marginVertical: 10,
        width: '90%',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 4,
    },
    cardTitle: {
        color: '#EDE7F6',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    progressInfo: {
        marginTop: 10,
        alignItems: 'center',
    },
    progressText: {
        color: '#D1C4E9',
        fontSize: 14,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 20,
    },
    statBox: {
        backgroundColor: '#2A2540',
        borderRadius: 12,
        padding: 18,
        width: '47%',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
    },
    statLabel: {
        color: '#B39DDB',
        fontSize: 14,
        marginBottom: 6,
    },
    statValue: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
});
