// utils/xp.js
/**
 * Gibt die XP zurück, die einer Priorität entsprechen:
 * Prio 1 → 10 XP, Prio 2 → 20 XP, …
 */
export function getXPFromPriority(priority) {
    const p = parseInt(priority, 10);
    if (isNaN(p) || p < 1) return 0;
    return p * 10;
}
