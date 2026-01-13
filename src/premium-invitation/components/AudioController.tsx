import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
    enabled: boolean;
    src?: string;
    startTimeSec?: number;
    volume?: number;   // 0..1
    fadeInMs?: number; // e.g. 2500
    startedByUser: boolean; // must become true only after tap-to-open
};

const LS_KEY = "premiumInviteMuted";

export function AudioController({
    enabled,
    src,
    startTimeSec = 0,
    volume = 0.6,
    fadeInMs = 2500,
    startedByUser,
}: Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [muted, setMuted] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return window.localStorage.getItem(LS_KEY) === "1";
    });

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(LS_KEY, muted ? "1" : "0");
    }, [muted]);

    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;
        a.muted = muted;
    }, [muted]);

    useEffect(() => {
        if (!enabled || !src) return;
        if (!startedByUser) return;

        const a = audioRef.current;
        if (!a) return;

        let raf = 0;
        let startTs = 0;

        const begin = async () => {
            try {
                a.currentTime = Math.max(0, startTimeSec);
                a.volume = 0;
                a.loop = true;

                await a.play(); // compliant because startedByUser comes from user gesture

                startTs = performance.now();
                const step = (t: number) => {
                    const elapsed = t - startTs;
                    const p = Math.min(1, elapsed / Math.max(1, fadeInMs));
                    a.volume = volume * p;
                    if (p < 1) raf = requestAnimationFrame(step);
                };
                raf = requestAnimationFrame(step);
            } catch {
                // silent (autoplay policy / missing src)
            }
        };

        begin();
        return () => cancelAnimationFrame(raf);
    }, [enabled, src, startedByUser, startTimeSec, volume, fadeInMs]);

    const ariaLabel = useMemo(() => (muted ? "Unmute music" : "Mute music"), [muted]);

    if (!enabled || !src) return null;

    return (
        <>
            <audio ref={audioRef} src={src} preload="metadata" />
            <button
                type="button"
                aria-label={ariaLabel}
                onClick={() => setMuted((m) => !m)}
                className="fixed z-50 right-4 bottom-4 rounded-full shadow-lg bg-white/85 backdrop-blur px-4 py-3 text-sm border border-black/10"
            >
                {muted ? "🔇" : "🔊"}
            </button>
        </>
    );
}
