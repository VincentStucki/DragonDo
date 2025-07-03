// hooks/useOccurrences.js
import { useMemo } from 'react';

/**
 * Liefert:
 *  - einmalige Tasks in den nächsten daysAhead Tagen
 *  - wiederkehrende Tasks (täglich, wöchentlich, monatlich, jährlich) nur
 *    wenn sie auf das heutige Datum fallen
 */
export function useOccurrences(tasks, daysAhead = 7) {
    return useMemo(() => {
        const now = new Date();
        const today = new Date(now); today.setHours(0, 0, 0, 0);
        const end = new Date(today); end.setDate(end.getDate() + daysAhead);

        const list = [];

        tasks.forEach((task, idx) => {
            const orig = new Date(task.date);
            const freq = task.recurrence;
            // Einmalige Tasks → alle Occurrences zwischen heute und end
            if (freq === 'Einmalig') {
                let cur = new Date(orig);
                if (cur >= today && cur <= end) {
                    list.push({ original: task, date: cur, key: `one-${idx}-${cur.toISOString()}` });
                }
            } else {
                // Wiederkehrende Tasks → nur einmal für heute, wenn Regel passt
                let matches = false;
                const d = new Date(today);
                switch (freq) {
                    case 'Täglich':
                        matches = true;
                        break;
                    case 'Wöchentlich':
                        matches = orig.getDay() === d.getDay();
                        break;
                    case 'Monatlich':
                        matches = orig.getDate() === d.getDate();
                        break;
                    case 'Jährlich':
                        matches = orig.getDate() === d.getDate()
                            && orig.getMonth() === d.getMonth();
                        break;
                }
                if (matches) {
                    // Occurrence heute zur Uhrzeit von orig
                    const occ = new Date(d);
                    occ.setHours(orig.getHours(), orig.getMinutes(), 0, 0);
                    list.push({ original: task, date: occ, key: `rec-${idx}-${occ.toISOString()}` });
                }
            }
        });

        // nach Datum+Zeit aufsteigend
        return list.sort((a, b) => a.date - b.date);
    }, [tasks, daysAhead]);
}
