import { AnimatePresence, motion } from "framer-motion";
import { OpeningAnimation } from "./OpeningAnimation";
import { type PremiumInvitationConfig } from "../config/types";

interface IntroOverlayProps {
    config: PremiumInvitationConfig;
    onOpen: () => void;
    isVisible: boolean; // Controls exit animation
}

export function IntroOverlay({ config, onOpen, isVisible }: IntroOverlayProps) {
    const isVideo = config.media.opening.type === "video";
    const videoUrl = isVideo ? "/premium/intro/weddinenv.mp4" : "";

    // Fullscreen Video Mode
    if (isVideo && videoUrl) {
        return (
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.8 } }}
                    >
                        <video
                            src={videoUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay
                            muted
                            playsInline
                            onClick={(e) => {
                                const v = e.currentTarget;
                                v.muted = false;
                                if (v.paused) v.play();
                            }}
                            onEnded={onOpen}
                            onError={(e) => {
                                console.error("Video error:", e);
                            }}
                        />

                        {/* Skip Button */}
                        <div className="absolute top-6 right-6 z-50">
                            <button
                                onClick={onOpen}
                                className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs uppercase tracking-widest hover:bg-white/20 transition-colors"
                            >
                                {config.content.labels.skipButton}
                            </button>
                        </div>

                        {/* Subtle hint to tap if needed, or remove completely if cleaner */}
                        <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { delay: 2 } }}
                                className="text-white/50 text-xs tracking-widest uppercase"
                            >
                                {config.content.labels.tapToUnmute}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // Standard Card Mode (Monogram / Lottie)
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#fafaf9]/30 backdrop-blur-sm"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                >
                    {/* Background Layer with subtle overlay for readability */}
                    <div className="absolute inset-0 bg-stone-50/40 backdrop-blur-md" />

                    <motion.div
                        className="relative z-10 w-full max-w-sm"
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    >
                        {/* Glass Card Container */}
                        <div className="glass-panel p-8 md:p-12 rounded-[32px] text-center flex flex-col items-center gap-8 shadow-2xl shadow-stone-200/50 border-white/60">

                            <div className="space-y-4">
                                <motion.div
                                    className="text-scale-small uppercase tracking-[0.3em] text-stone-500 font-medium"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {config.content.introHeadline}
                                </motion.div>

                                <h1 className="font-serif-heading text-scale-heading text-stone-900 leading-tight">
                                    {config.content.coupleNames}
                                </h1>
                            </div>

                            <div className="w-full flex justify-center py-4">
                                <OpeningAnimation
                                    asset={config.media.opening}
                                    monogram={config.content.monogramInitials}
                                    accent={config.style.secondaryColor}
                                />
                            </div>

                            <motion.button
                                onClick={onOpen}
                                className="premium-button-primary w-full shadow-lg shadow-stone-900/10 group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="group-hover:tracking-wider transition-all duration-300">
                                    {config.content.rsvp.openButton || "Tap to Open"}
                                </span>
                            </motion.button>

                            {config.media.audio.enabled && (
                                <div className="text-scale-small uppercase tracking-wider text-stone-400 mt-2 flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-stone-400" />
                                    {config.content.labels.musicPlayHint}
                                    <span className="w-1 h-1 rounded-full bg-stone-400" />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
