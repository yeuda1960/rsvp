import React, { useEffect, useState } from "react";
import type { PremiumEventOverride } from "../../premium-invitation/config/types";
import { loadPublishedEventOverride } from "../../premium-invitation/config/storage";
import { PremiumInvitationPage } from "../../premium-invitation/components/PremiumInvitationPage";

/**
 * Public premium invite route:
 * - Loads PUBLISHED premium config internally (hook)
 * - Loads PUBLISHED event override here (optional) and merges with base event data
 * - Uses existing RSVP logic/hooks exactly as-is
 */

export default function PremiumInviteRoute() {
    // 🔌 INTEGRATION POINT: base event + existing RSVP logic
    const event = useEventData();       // existing
    const rsvp = useExistingRsvpFlow(); // existing

    const [pubOverride, setPubOverride] = useState<PremiumEventOverride | null>(null);

    useEffect(() => {
        (async () => {
            const o = await loadPublishedEventOverride();
            setPubOverride(o ?? {});
        })();
    }, []);

    if (!event?.ready || !rsvp?.ready || pubOverride === null) {
        return <div className="min-h-screen bg-white" />;
    }

    const mergedEvent = {
        dateText: pubOverride.dateText ?? event.dateText,
        timeText: pubOverride.timeText ?? event.timeText,
        venueName: pubOverride.venueName ?? event.venueName,
        addressText: pubOverride.addressText ?? event.addressText ?? event.address,
        dressCode: pubOverride.dressCode ?? event.dressCode,
        notes: pubOverride.notes ?? event.notes,
        coords: {
            lat: pubOverride.lat ?? event.lat,
            lng: pubOverride.lng ?? event.lng,
        },
        wazeLink: pubOverride.wazeLink,
        mapsLink: pubOverride.mapsLink,
    };

    const deadlineIso = pubOverride.rsvpDeadlineIso ?? event.rsvpDeadlineIso;

    return (
        <>
            {/* Back to Editor Button (Floating) */}
            <a
                href="/admin/premium-invitation"
                className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur border border-stone-200 shadow-sm px-4 py-2 rounded-full text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-white transition-all flex items-center gap-2"
            >
                <span>←</span> חזרה לעורך
            </a>

            <PremiumInvitationPage
                eventDetails={mergedEvent}
                rsvpDeadlineIso={deadlineIso}
                existingForm={rsvp.form}
                setExistingForm={rsvp.setForm}
                validateCurrentState={rsvp.validate}
                submitRsvp={rsvp.submit}
                hasSubmitted={rsvp.hasSubmitted}
                startEdit={rsvp.startEdit}
                cancelEdit={rsvp.cancelEdit}
                isEditing={rsvp.isEditing}
            />
        </>
    );
}

/**
 * Mock adapters - replace with real hooks later
 */
function useEventData(): any {
    return {
        ready: true,
        dateText: "Saturday, February 15, 2026",
        timeText: "18:00",
        venueName: "Grand Ballroom",
        addressText: "123 Wedding Street, Tel Aviv",
        address: "123 Wedding Street, Tel Aviv",
        lat: 32.0853,
        lng: 34.7818,
        dressCode: "Formal",
        notes: "",
        rsvpDeadlineIso: "2026-02-01T21:00:00.000Z",
    };
}

function useExistingRsvpFlow(): any {
    const [form, setForm] = React.useState({
        attending: true,
        guestsCount: 2,
        dietary: "",
        notes: "",
    });
    const [submitted, setSubmitted] = React.useState(false);
    const [editing, setEditing] = React.useState(false);

    return {
        ready: true,
        form,
        setForm,
        validate: () => ({ ok: true }),
        submit: async () => {
            setSubmitted(true);
            setEditing(false);
        },
        hasSubmitted: submitted,
        startEdit: () => setEditing(true),
        cancelEdit: () => setEditing(false),
        isEditing: editing,
    };
}
