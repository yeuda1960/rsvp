import { type PremiumInvitationConfig, type PremiumEventOverride } from "../config/types";
import { LottiePlayer } from "./LottiePlayer";

// Icons
const IconMap = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
// Standard Waze icon path
const IconWaze = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.5-2.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z" opacity="0.8" /></svg>
);

export function EventDetailsCard({
    config,
    override = {},
}: {
    config: PremiumInvitationConfig;
    override?: PremiumEventOverride;
}) {
    // Data with fallback to defaults or config
    const dateText = override.dateText || "Feb 15";
    const timeText = override.timeText || "18:00";
    const venueName = override.venueName || "Grand Ballroom";
    const addressText = override.addressText || "123 Wedding Street, Tel Aviv";
    const notes = override.notes || "";

    // Links: use override if present, otherwise minimal defaults or hidden (logic handled in JSX)



    const labels = config.content.labels;

    return (
        <div className="premium-card p-10 md:p-14 text-center transition-transform hover:scale-[1.01] duration-700 w-full max-w-2xl mx-auto relative group-card overflow-hidden">
            {/* Lottie Decorations - Rotated horizontal strips tiled to cover height */}
            <div className="absolute top-1/2 -left-[150px] -translate-y-1/2 w-[300px] h-[600px] pointer-events-none flex flex-row z-0 opacity-80 mix-blend-multiply origin-center">
                <div className="w-full h-full relative">
                    <LottiePlayer
                        src="/premium/lottie/event-side-decoration.json"
                        className="w-full h-full object-contain -rotate-90 scale-[1.5]"
                    />
                </div>
            </div>
            <div className="absolute top-1/2 -right-[150px] -translate-y-1/2 w-[300px] h-[600px] pointer-events-none flex flex-row z-0 opacity-80 mix-blend-multiply origin-center">
                <div className="w-full h-full relative">
                    <LottiePlayer
                        src="/premium/lottie/event-side-decoration.json"
                        className="w-full h-full object-contain rotate-90 scale-[1.5]"
                    />
                </div>
            </div>

            <div className="space-y-12 relative z-10">
                {/* HEADLINES */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:divide-x md:divide-stone-100">
                    <div className="px-6 min-w-[120px]">
                        <div className="text-scale-small uppercase tracking-[0.25em] text-stone-400 mb-2 font-medium">{labels.date}</div>
                        <div className="font-serif-heading text-scale-heading text-stone-800">
                            {dateText}
                        </div>
                        {/* <div className="text-sm text-stone-500 mt-2 font-light">Saturday</div> */}
                    </div>
                    <div className="px-6 min-w-[120px] hidden md:block">
                        {/* Visual divider spacer */}
                    </div>
                    <div className="px-6 min-w-[120px]">
                        <div className="text-scale-small uppercase tracking-[0.25em] text-stone-400 mb-2 font-medium">{labels.time}</div>
                        <div className="font-serif-heading text-scale-heading text-stone-800">
                            {timeText}
                        </div>
                        {/* <div className="text-sm text-stone-500 mt-2 font-light">Reception</div> */}
                    </div>
                </div>

                {/* VISUAL SEPARATOR */}
                <div className="w-16 h-[1px] bg-stone-200 mx-auto" />

                {/* VENUE INFO */}
                <div className="space-y-3">
                    <div className="text-scale-small uppercase tracking-[0.25em] text-stone-400 font-medium">{labels.venue}</div>
                    <h3 className="font-serif-heading text-scale-heading text-stone-900">{venueName}</h3>
                    <p className="text-stone-500 font-light leading-relaxed max-w-sm mx-auto text-scale-body">
                        {addressText}<br />
                        <span className="text-scale-small text-stone-400 mt-1 block tracking-wide">{notes}</span>
                    </p>
                </div>

                {/* ACTION BUTTONS */}
                {(override.wazeLink || override.mapsLink) && (
                    <div className="flex flex-col gap-4 max-w-[240px] mx-auto pt-2">
                        {override.wazeLink && (
                            <a
                                href={override.wazeLink}
                                target="_blank"
                                rel="noreferrer"
                                className="premium-button-outline w-full flex items-center justify-center gap-3 py-3 !border-stone-200 hover:!border-stone-800 hover:!bg-stone-50 !rounded-full group"
                            >
                                <span className="text-stone-400 group-hover:text-stone-800 transition-colors"><IconWaze /></span>
                                <span className="text-xs tracking-widest font-medium">ניווט ב-WAZE</span>
                            </a>
                        )}
                        {override.mapsLink && (
                            <a
                                href={override.mapsLink}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 text-[10px] text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-[0.15em] py-2"
                            >
                                <IconMap />
                                <span>Google Maps</span>
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
