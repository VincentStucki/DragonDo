import { useMemo } from 'react';
//Filtert die Reihenfolge nach Datum und Zeit
export function useFilteredTasks(tasks) {
    const now = new Date();

    return useMemo(() => {
        return tasks
            .map(task => {
                const dt = new Date(task.date);
                const isPastDate =
                    dt.setHours(0, 0, 0, 0) < new Date(now).setHours(0, 0, 0, 0);
                const isToday =
                    dt.setHours(0, 0, 0, 0) === new Date(now).setHours(0, 0, 0, 0);
                const isPastTime = dt < now;
                return { ...task, dt, isPastDate, isToday, isPastTime };
            })
            .filter(t => !t.isPastDate);
    }, [tasks, now]);
}
