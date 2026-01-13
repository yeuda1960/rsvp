/**
 * Returns true if the user prefers reduced motion.
 * Used to disable animations / transitions gracefully.
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Utility easing (optional future use)
 */
export function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}
