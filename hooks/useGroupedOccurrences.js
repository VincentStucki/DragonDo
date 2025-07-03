import { useMemo } from 'react';
import { useOccurrences } from './useOccurrences';

/**
 * Gruppiert Occurrences nach Monat und Tag:
 * Liefert: [{ month, day, data: [occ,...] }, ...]
 * Monat/Tage aufsteigend sortiert, data nach Uhrzeit aufsteigend.
 */
export function useGroupedOccurrences(tasks, daysAhead = 7) {
    const occ = useOccurrences(tasks, daysAhead);

    return useMemo(() => {
        const map = {};
        occ.forEach(item => {
            const m = item.date.toLocaleDateString('de-DE', { year: 'numeric', month: 'long' });
            const d = item.date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
            const key = `${m}|${d}`;
            if (!map[key]) map[key] = { month: m, day: d, data: [] };
            map[key].data.push(item);
        });
        // in Array + sortiere Monat/Tag aufsteigend
        return Object.values(map)
            .sort((a, b) => {
                const da = new Date(`${a.month} 1`).getTime();
                const db = new Date(`${b.month} 1`).getTime();
                if (da !== db) return da - db;
                // gleiche Monatsgruppe: sortiere Tage
                const dayA = new Date(a.data[0].date).setHours(0, 0, 0, 0);
                const dayB = new Date(b.data[0].date).setHours(0, 0, 0, 0);
                return dayA - dayB;
            });
    }, [occ]);
}
