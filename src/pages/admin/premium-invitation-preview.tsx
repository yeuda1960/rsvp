import React, { useEffect, useState } from "react";
import type {
    PremiumEventOverride,
    PremiumInvitationConfig,
} from "../../premium-invitation/config/types";
import {
    loadDraftEventOverride,
    loadDraftPremiumConfig,
} from "../../premium-invitation/config/storage";
import { PremiumInvitationPage } from "../../premium-invitation/components/PremiumInvitationPage";

/**
 * Admin-only preview page.
 * It loads DRAFT (not published) config + DRAFT event override.
 *
 * IMPORTANT: protect this route using your existing admin auth/guard.
 */

export default function AdminPremiumInvitationPreview() {
    const [cfg, setCfg] = useState<PremiumInvitationConfig | null>(null);
    const [eventOverride, setEventOverride] = useState<PremiumEventOverride | null>(null);

    useEffect(() => {
        // Initial load
        (async () => {
            const dCfg = await loadDraftPremiumConfig();
            const dEvent = await loadDraftEventOverride();
            // Only set if we haven't received a real-time update yet (optional strategy, but simple set is fine)
            setCfg(dCfg);
            setEventOverride(dEvent);
        })();

        // Real-time updates
        const handleMsg = (e: MessageEvent) => {
            if (e.data?.type === "PREVIEW_UPDATE") {
                if (e.data.config) setCfg(e.data.config);
                if (e.data.eventOverride) setEventOverride(e.data.eventOverride);
            }
        };
        window.addEventListener("message", handleMsg);
        return () => window.removeEventListener("message", handleMsg);
    }, []);

    // 🔌 INTEGRATION POINT: existing data & RSVP logic
    const event = useEventData();       // existing
    const rsvp = useExistingRsvpFlow(); // existing

    if (!cfg || !eventOverride || !event?.ready || !rsvp?.ready) {
        return <div className="min-h-screen bg-white" />;
    }

    // Merge base event with draft overrides
    const mergedEvent = {
        dateText: eventOverride.dateText ?? event.dateText,
        timeText: eventOverride.timeText ?? event.timeText,
        venueName: eventOverride.venueName ?? event.venueName,
        addressText: eventOverride.addressText ?? event.addressText ?? event.address,
        dressCode: eventOverride.dressCode ?? event.dressCode,
        notes: eventOverride.notes ?? event.notes,
        coords: {
            lat: eventOverride.lat ?? event.lat,
            lng: eventOverride.lng ?? event.lng,
        },
        wazeLink: eventOverride.wazeLink,
        mapsLink: eventOverride.mapsLink,
    };

    const deadlineIso = eventOverride.rsvpDeadlineIso ?? event.rsvpDeadlineIso;

    return (
        <PremiumInvitationPage
            // Draft config injected for preview
            configOverride={cfg}
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
    );
}

/**
 * Mock adapters for preview - replace with real hooks later
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
