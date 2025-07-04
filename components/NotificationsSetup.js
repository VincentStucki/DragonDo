import { useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { setupNotificationChannel, scheduleDailyReminder } from '../utils/notificationUtils';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export default function NotificationsSetup() {
    const { tasks } = useTasks();

    useEffect(() => {
        (async () => {
            await Notifications.requestPermissionsAsync();
            await setupNotificationChannel();
            await scheduleDailyReminder(tasks);
        })();
    }, [tasks]);

    return null;
}
