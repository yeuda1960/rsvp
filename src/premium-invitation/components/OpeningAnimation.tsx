import type { OpeningAsset } from "../config/types";
import { LottiePlayer } from "./LottiePlayer";

export function OpeningAnimation({
    asset,
    monogram,
    accent,
}: {
    asset: OpeningAsset;
    monogram: string;
    accent: string;
}) {
    if (asset.type === "video") {
        return (
            <div className="w-full max-w-[420px] mx-auto text-center">
                <video
                    src={asset.url}
                    className="w-full rounded-2xl shadow-sm mb-6"
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                />
                <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full text-sm font-serif border border-black/10 text-black/40"
                    style={{ borderColor: `${accent}40`, color: accent }}
                >
                    {monogram}
                </div>
            </div>
        );
    }

    if (asset.type === "lottie") {
        return (
            <div className="w-full max-w-[420px] mx-auto text-center">
                <LottiePlayer src={asset.url} loop={false} />
                <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full text-sm font-serif border border-black/10 text-black/40 mt-6"
                    style={{ borderColor: `${accent}40`, color: accent }}
                >
                    {monogram}
                </div>
            </div>
        );
    }

    // Fallback monogram (Main focus when no animation)
    return (
        <div className="w-full max-w-[360px] mx-auto">
            <div className="rounded-3xl border border-black/10 bg-white/60 backdrop-blur px-10 py-12 shadow-sm text-center">
                <div
                    className="mx-auto h-24 w-24 rounded-full flex items-center justify-center text-3xl font-serif"
                    style={{ border: `1px solid ${accent}40`, color: accent }}
                >
                    {monogram}
                </div>
                <div className="mt-6 text-xs tracking-[0.35em] text-black/50 font-medium">WELCOME</div>
            </div>
        </div>
    );
}
