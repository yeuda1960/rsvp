import { useState, useMemo } from "react";
import { type PremiumInvitationConfig, type PremiumEventOverride } from "../config/types";
import { usePremiumInvitationConfig } from "../config/usePremiumConfig";
import { IntroOverlay } from "./IntroOverlay";
import { EventDetailsCard } from "./EventDetailsCard";
import { RSVPStepperWrapper } from "./RSVPStepperWrapper";
import { ScrollSection } from "./ScrollSection";
import { AudioController } from "./AudioController";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
    configOverride?: PremiumInvitationConfig;
    eventDetails: PremiumEventOverride;
    rsvpDeadlineIso: string;
    existingForm: any;
    setExistingForm: (v: any) => void;
    validateCurrentState: () => { ok: boolean; message?: string };
    submitRsvp: () => Promise<void>;
    hasSubmitted: boolean;
    startEdit: () => void;
    cancelEdit: () => void;
    isEditing: boolean;
};

export function PremiumInvitationPage(props: Props) {
    const { config: publishedConfig, loading } = usePremiumInvitationConfig();
    const config = props.configOverride ?? publishedConfig;

    const [isOpen, setIsOpen] = useState(false);

    const deadlinePassed = useMemo(() => {
        const t = new Date(props.rsvpDeadlineIso).getTime();
        if (!Number.isFinite(t)) return false;
        return Date.now() > t;
    }, [props.rsvpDeadlineIso]);

    if (!config || (!props.configOverride && loading)) {
        return <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center text-stone-300">Loading...</div>;
    }

    // Determine background texture class
    const textureClass =
        config.style.texture === "paper"
            ? "bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"
            : config.style.texture === "linen"
                ? "bg-[url('https://www.transparenttextures.com/patterns/linen.png')]"
                : "";

    return (
        <div
            className={`min-h-screen w-full overflow-x-hidden relative transition-colors duration-1000 ${textureClass}`}
            style={{
                backgroundColor: config.style.primaryColor || "#fafaf9",
                fontFamily: config.style.bodyFont,
                color: config.style.secondaryColor || "#1c1917",
                "--font-scale-hero": config.style.fontSize?.hero ?? 1.0,
                "--font-scale-heading": config.style.fontSize?.heading ?? 1.0,
                "--font-scale-body": config.style.fontSize?.body ?? 1.0,
                "--font-scale-small": config.style.fontSize?.small ?? 1.0,
                "--font-scale-intro": config.style.fontSize?.intro ?? 1.0,
            } as React.CSSProperties}
        >
            <IntroOverlay
                config={config}
                onOpen={() => setIsOpen(true)}
                isVisible={!isOpen}
            />

            <AudioController
                enabled={config.media.audio.enabled}
                src={config.media.audio.enabled ? "/audio/All_You_Need_Is_Love-104256-mobiles24.mp3" : undefined}
                startTimeSec={config.media.audio.enabled ? config.media.audio.startTimeSec : 0}
                volume={config.media.audio.enabled ? config.media.audio.volume : 0.6}
                fadeInMs={config.media.audio.enabled ? config.media.audio.fadeInMs : 2500}
                startedByUser={isOpen}
            />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="relative z-10 pb-24"
                    >
                        {/* HERO SECTION */}
                        <ScrollSection className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative">
                            {/* GIF Background Layer */}
                            {config.media.heroGifUrl && (
                                <div className="absolute inset-0 z-0 overflow-hidden">
                                    <img
                                        src={config.media.heroGifUrl}
                                        alt="Background"
                                        className="w-full h-full object-cover opacity-80"
                                        style={{ transform: `scale(${config.media.heroGifScale ?? 1.1})` }}
                                    />
                                    {/* Overlay for contrast if needed, can be adjusted */}
                                    <div className="absolute inset-0 bg-white/20" />
                                </div>
                            )}

                            {/* Content Container - Conditional Wrapper */}
                            <div className={`relative z-10 flex flex-col items-center ${config.media.heroGifUrl ? "bg-white/60 backdrop-blur-md p-12 rounded-[3rem] shadow-xl border border-white/40" : ""}`}>
                                {/* Decorative element top */}
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                    className="mb-12 text-scale-intro uppercase tracking-[0.4em] text-stone-500 font-medium"
                                    style={{ fontSize: `calc(0.75rem * ${config.style.fontSize?.intro ?? 1})` }}
                                >
                                    {config.content.introHeadline}
                                </motion.div>

                                <motion.h1
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                                    className="font-serif-heading text-scale-hero text-stone-900 leading-tight mb-8 drop-shadow-sm"
                                    style={{ fontFamily: config.style.headingFont }}
                                >
                                    {config.content.coupleNames}
                                </motion.h1>

                                {/* Decorative Line */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 1.2, duration: 1.5, ease: "anticipate" }}
                                    className="w-24 h-[1px] bg-stone-400/50 my-10"
                                />

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.5, duration: 1 }}
                                    className="max-w-md text-scale-body text-stone-600 leading-relaxed font-light"
                                >
                                    {config.content.welcomeText}
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.5, duration: 1 }}
                                className="absolute bottom-12 left-0 right-0 flex justify-center animate-bounce-slow z-20"
                            >
                                <div className="flex flex-col items-center gap-2 opacity-60">
                                    <span className="text-[10px] tracking-widest uppercase">{config.content.labels.scrollHint}</span>
                                    <div className="w-[1px] h-8 bg-stone-900" />
                                </div>
                            </motion.div>
                        </ScrollSection>

                        <div className="max-w-xl mx-auto px-4 space-y-24 md:space-y-32">
                            {config.content.sectionOrder.map((sectionId) => {
                                if (sectionId === "eventDetails") {
                                    return (
                                        <ScrollSection key="eventDetails">
                                            {/* EVENT DETAILS CARD */}
                                            <div id="eventDetails" className="scroll-mt-24 px-6 md:px-0">
                                                <EventDetailsCard config={config} override={props.eventDetails} />
                                            </div>
                                        </ScrollSection>
                                    );
                                }
                                if (sectionId === "rsvp") {
                                    return (
                                        <ScrollSection key="rsvp">
                                            <div className="premium-card p-6 md:p-12 relative overflow-hidden">
                                                {/* Subtle decorative background in card */}
                                                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none transform translate-x-1/3 -translate-y-1/3">
                                                    <span className="text-9xl font-serif">R</span>
                                                </div>

                                                <RSVPStepperWrapper
                                                    config={config}
                                                    existingForm={props.existingForm}
                                                    setExistingForm={props.setExistingForm}
                                                    validateCurrentState={props.validateCurrentState}
                                                    submit={props.submitRsvp}
                                                    canEdit={!deadlinePassed}
                                                    isEditing={props.isEditing}
                                                    onStartEdit={props.startEdit}
                                                    onCancelEdit={props.cancelEdit}
                                                    submitted={props.hasSubmitted}
                                                    isDeadlinePassed={deadlinePassed}
                                                />
                                            </div>
                                        </ScrollSection>
                                    );
                                }
                                return null;
                            })}

                            <ScrollSection>
                                <footer className="text-center py-20 opacity-80">
                                    <h2 className="font-serif-heading text-3xl md:text-4xl text-stone-800 mb-6">
                                        {config.content.thankYou.title}
                                    </h2>
                                    <div className="w-8 h-[1px] bg-stone-300 mx-auto mb-6" />
                                    <p className="text-stone-500 font-light text-lg mb-12 max-w-sm mx-auto">
                                        {config.content.thankYou.body}
                                    </p>
                                    <div className="text-[10px] uppercase tracking-[0.3em] text-stone-300">
                                        {config.content.footerText}
                                    </div>
                                </footer>
                            </ScrollSection>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
