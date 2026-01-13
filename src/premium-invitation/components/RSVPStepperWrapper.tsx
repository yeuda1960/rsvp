import { useState } from "react";
import { type PremiumInvitationConfig } from "../config/types";

type Props = {
    // We pass full config to access all dynamic labels/logic
    config: PremiumInvitationConfig;

    // Existing RSVP state
    existingForm: any;
    setExistingForm: (v: any) => void;
    validateCurrentState: () => { ok: boolean; message?: string };
    submit: () => Promise<void>;

    // Controls
    canEdit: boolean;
    isEditing: boolean;
    onStartEdit: () => void;
    onCancelEdit: () => void;

    // States passed from parent to keep it pure
    submitted: boolean;
    isDeadlinePassed: boolean;
};

export function RSVPStepperWrapper({
    config,
    existingForm,
    setExistingForm,
    validateCurrentState,
    submit,
    canEdit,
    isEditing,
    onStartEdit,
    onCancelEdit,
    submitted,
    isDeadlinePassed,
}: Props) {
    const [step, setStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Helpers to update form
    const handleChange = (field: string, val: any) => {
        setExistingForm((prev: any) => ({ ...prev, [field]: val }));
    };

    const nextStep = () => {
        const v = validateCurrentState();
        if (!v.ok) {
            setError(v.message ?? "Please complete required fields.");
            return;
        }
        setError(null);

        // Conditional Routing based on attending state
        if (step === 0) {
            if (existingForm?.attending === false) {
                // If not attending, go straight to negative confirmation (Step 3)
                setStep(3);
                return;
            }
            // If attending, go to guests (Step 1)
            setStep(1);
            return;
        }

        setStep((s) => s + 1);
    };

    const prevStep = () => {
        setError(null);
        setStep((s) => Math.max(0, s - 1));
    };

    const handleAttendingChange = (isAttending: boolean) => {
        handleChange("attending", isAttending);
        // User explicitly requested NO auto-advance. 
        // They must click "Next" / "Continue" to proceed.
    };

    const handleSubmit = async () => {
        const v = validateCurrentState();
        if (!v.ok) {
            setError(v.message ?? "Please complete required fields.");
            return;
        }
        setError(null);
        setSubmitting(true);
        try {
            await submit();
            setStep(0);
        } finally {
            setSubmitting(false);
        }
    };

    // Derived form state alias
    const form = existingForm || {};

    return (
        <div className="relative">
            {/* Header / Edit Controls */}
            {!submitted && !isDeadlinePassed && (
                <div className="absolute top-0 right-0 z-10 w-full flex justify-end">
                    {!isEditing && canEdit && hasAnyData(form) && (form.attending !== undefined) && (
                        <button
                            onClick={onStartEdit}
                            className="text-[10px] uppercase tracking-wider text-stone-400 hover:text-stone-800 transition-colors"
                        >
                            Edit
                        </button>
                    )}
                    {isEditing && (
                        <button
                            onClick={onCancelEdit}
                            className="text-[10px] uppercase tracking-wider text-red-400 hover:text-red-700 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 text-center animate-shake">
                    {error}
                </div>
            )}

            {/* THANK YOU STATE - Hide if editing */}
            {(submitted && !isEditing || isDeadlinePassed) && (
                <div className="text-center py-10">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                        {form.attending === false ? "🤍" : "✨"}
                    </div>
                    <h3 className="font-serif-heading text-scale-heading text-stone-900 mb-3">
                        {/* Dynamic Title */}
                        {isDeadlinePassed
                            ? config.content.thankYou.deadlinePassed
                            : (form.attending === false
                                ? (config.content.rsvp.notAttendingTitle || "מצטערים שלא תוכלו להגיע") // Fallback if not configured
                                : config.content.thankYou.title)
                        }
                    </h3>
                    <p className="text-stone-600 font-light max-w-xs mx-auto mb-8 leading-relaxed">
                        {isDeadlinePassed
                            ? "Use the contact details above to reach us."
                            : (form.attending === false
                                ? "מקווים שנזכה לשמוח יחד באירועים הבאים" // Custom message for not attending
                                : config.content.thankYou.body)
                        }
                    </p>

                    {!isDeadlinePassed && canEdit && (submitted) && (
                        <button
                            onClick={() => {
                                onStartEdit();
                                setStep(0);
                            }}
                            className="text-xs uppercase tracking-wider text-stone-400 hover:text-stone-900 transition-colors border-b border-stone-200 pb-1 hover:border-stone-900"
                        >
                            {config.content.rsvp.editResponse || "Change Response"}
                        </button>
                    )}
                </div>
            )}

            {/* STEPPER UI */}
            {(!submitted || isEditing) && !isDeadlinePassed && (
                <div>
                    {/* PROGRESS INDICATOR (Not shown for negative flow step 3) */}
                    {step < 3 && (
                        <div className="flex justify-center gap-2 mb-10">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-500 ease-out ${i === step ? "w-8 bg-stone-800" : i < step ? "w-2 bg-stone-800" : "w-1 bg-stone-200"
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    <div className="min-h-[250px] flex flex-col justify-between">
                        {/* STEP 0: ATTENDANCE */}
                        {step === 0 && (
                            <div className="space-y-6 text-center animate-fade-in">
                                <h3 className="font-serif-heading text-scale-heading text-stone-900">
                                    {config.content.rsvp.questionAttending}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleAttendingChange(true)}
                                        className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 group ${form.attending === true
                                            ? "border-stone-800 bg-stone-50 shadow-inner"
                                            : "border-stone-200 hover:border-stone-400 hover:-translate-y-1"
                                            }`}
                                    >
                                        <span className="text-2xl group-hover:scale-110 transition-transform">🎉</span>
                                        <span className="text-scale-small font-bold uppercase tracking-widest text-stone-600">
                                            {config.content.rsvp.yesOption}
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleAttendingChange(false)}
                                        className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 group ${form.attending === false
                                            ? "border-stone-800 bg-stone-50 shadow-inner"
                                            : "border-stone-200 hover:border-stone-400 hover:-translate-y-1"
                                            }`}
                                    >
                                        <span className="text-2xl group-hover:scale-110 transition-transform">🤍</span>
                                        <span className="text-scale-small font-bold uppercase tracking-widest text-stone-600">
                                            {config.content.rsvp.noOption}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 1: GUESTS & CHILDREN */}
                        {step === 1 && (
                            <div className="space-y-8 animate-fade-in text-center">
                                <h3 className="font-serif-heading text-scale-heading text-stone-900">
                                    {config.content.rsvp.questionGuests}
                                </h3>

                                {/* Total Guests */}
                                <div className="flex items-center justify-center gap-8">
                                    <button
                                        onClick={() => handleChange("guestsCount", Math.max(1, (form.guestsCount || 1) - 1))}
                                        className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-all text-xl"
                                    >
                                        −
                                    </button>
                                    <span className="font-serif-heading text-scale-hero text-stone-900 w-16 text-center">
                                        {form.guestsCount || 1}
                                    </span>
                                    <button
                                        onClick={() => handleChange("guestsCount", Math.min(10, (form.guestsCount || 1) + 1))}
                                        className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-all text-xl"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-scale-small text-stone-400 uppercase tracking-widest">
                                    {config.content.rsvp.guestsSubtitle}
                                </p>

                                {/* Children Section */}
                                <div className="pt-4 border-t border-dashed border-stone-200 max-w-xs mx-auto">
                                    <label className="flex items-center justify-center gap-3 cursor-pointer text-stone-600 mb-4">
                                        <input
                                            type="checkbox"
                                            checked={!!form.hasChildren}
                                            onChange={(e) => handleChange("hasChildren", e.target.checked)}
                                            className="w-4 h-4 rounded text-stone-800 focus:ring-stone-800 border-stone-300"
                                        />
                                        <span className="text-sm">{config.content.rsvp.childrenCheckboxLabel || "Includes children?"}</span>
                                    </label>

                                    {form.hasChildren && (
                                        <div className="animate-fade-in bg-stone-50 p-4 rounded-xl">
                                            <div className="text-xs text-stone-500 mb-2">{config.content.rsvp.childrenCountLabel || "How many children?"}</div>
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    onClick={() => handleChange("childrenCount", Math.max(0, (form.childrenCount || 0) - 1))}
                                                    className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:border-stone-800"
                                                >
                                                    −
                                                </button>
                                                <span className="font-medium text-stone-900 w-8">
                                                    {form.childrenCount || 0}
                                                </span>
                                                <button
                                                    onClick={() => handleChange("childrenCount", Math.min((form.guestsCount || 1), (form.childrenCount || 0) + 1))}
                                                    className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:border-stone-800"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: DIETARY & NOTES */}
                        {step === 2 && (
                            <div className="space-y-8 animate-fade-in">
                                <h3 className="font-serif-heading text-scale-heading text-center text-stone-900">
                                    {config.content.rsvp.questionFinal}
                                </h3>
                                <div className="space-y-6">
                                    <div className="group">
                                        <input
                                            type="text"
                                            placeholder={config.content.rsvp.dietaryPlaceholder}
                                            value={form.dietary || ""}
                                            onChange={(e) => handleChange("dietary", e.target.value)}
                                            className="w-full bg-stone-50 border-0 border-b border-stone-200 px-0 py-3 text-stone-900 placeholder:text-stone-400 focus:ring-0 focus:border-stone-800 transition-colors bg-transparent"
                                        />
                                    </div>
                                    <div className="group">
                                        <textarea
                                            placeholder={config.content.rsvp.notesPlaceholder}
                                            rows={2}
                                            value={form.notes || ""}
                                            onChange={(e) => handleChange("notes", e.target.value)}
                                            className="w-full bg-stone-50 border-0 border-b border-stone-200 px-0 py-3 text-stone-900 placeholder:text-stone-400 focus:ring-0 focus:border-stone-800 transition-colors bg-transparent resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: NEGATIVE CONFIRMATION */}
                        {step === 3 && (
                            <div className="space-y-8 animate-fade-in text-center py-6">
                                <div className="text-4xl">🥺</div>
                                <h3 className="font-serif-heading text-2xl text-stone-900">
                                    {config.content.rsvp.notAttendingTitle || "Sorry you can't make it"}
                                </h3>
                                <p className="text-stone-500 max-w-xs mx-auto">
                                    {config.content.rsvp.notAttendingBody || "Please confirm your response so we can update our list."}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* NAVIGATION BUTTONS */}
                    <div className="flex gap-4 mt-12 pt-6 border-t border-stone-100">
                        {step !== 0 && step !== 3 && (
                            <button
                                onClick={prevStep}
                                className="premium-button-outline flex-1"
                            >
                                {config.content.rsvp.stepBack}
                            </button>
                        )}

                        {step === 3 && (
                            <button
                                onClick={() => setStep(0)}
                                className="premium-button-outline flex-1"
                            >
                                {config.content.rsvp.stepBack}
                            </button>
                        )}

                        <button
                            onClick={(step < 2 && step !== 3) ? nextStep : handleSubmit}
                            disabled={submitting}
                            className="premium-button-primary flex-1 shadow-xl shadow-stone-200"
                        >
                            {step === 3
                                ? (config.content.rsvp.notAttendingSubmit || "Send Response")
                                : (step < 2 ? config.content.rsvp.stepNext : submitting ? "Sending..." : config.content.rsvp.submit)
                            }
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}

function hasAnyData(form: any) {
    return form.attending !== undefined || form.guestsCount > 1 || form.dietary || form.notes;
}
