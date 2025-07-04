import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

//Benachrichtigung
export async function setupNotificationChannel() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Erinnerungen',
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'default',
        });
    }
}

export async function scheduleDailyReminder(tasks) {
    // Heute als Vergleich
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTasks = tasks.filter(t => {
        const taskDate = new Date(t.date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
    });

    const body =
        todayTasks.length > 0
            ? todayTasks.map(t => `• ${String(t.title || '')}`).join('\n')
            : 'Keine Aufgaben für heute 🎉';


    // Lösche eventuell alte Reminder
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Deine Aufgaben für heute',
            body,
            sound: 'default',
        },
        trigger: {
            hour: 6,
            minute: 0,
            repeats: true,
        },
    });
}
