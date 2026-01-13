import { PremiumInvitationConfig, PremiumEventOverride } from "./types";
import { defaultPremiumInvitationConfig } from "./defaultConfig";

const K = {
    draftCfg: "premiumInvite:draftCfg",
    publishedCfg: "premiumInvite:publishedCfg",
    draftEvent: "premiumInvite:draftEvent",
    publishedEvent: "premiumInvite:publishedEvent",
};

function safeParse<T>(v: string | null): T | null {
    if (!v) return null;
    try {
        return JSON.parse(v) as T;
    } catch {
        return null;
    }
}

// ---------------- Invitation Config ----------------

export async function loadDraftPremiumConfig(): Promise<PremiumInvitationConfig> {
    return (
        safeParse<PremiumInvitationConfig>(localStorage.getItem(K.draftCfg)) ??
        defaultPremiumInvitationConfig
    );
}

export async function saveDraftPremiumConfig(cfg: PremiumInvitationConfig) {
    localStorage.setItem(K.draftCfg, JSON.stringify(cfg));
    return true;
}

export async function loadPublishedPremiumConfig(): Promise<PremiumInvitationConfig> {
    return (
        safeParse<PremiumInvitationConfig>(localStorage.getItem(K.publishedCfg)) ??
        defaultPremiumInvitationConfig
    );
}

export async function publishPremiumConfig() {
    const draft = await loadDraftPremiumConfig();
    localStorage.setItem(K.publishedCfg, JSON.stringify(draft));
    return true;
}

export async function resetPremiumConfigToDefault() {
    localStorage.setItem(K.draftCfg, JSON.stringify(defaultPremiumInvitationConfig));
    localStorage.setItem(K.publishedCfg, JSON.stringify(defaultPremiumInvitationConfig));
    localStorage.removeItem(K.draftEvent);
    localStorage.removeItem(K.publishedEvent);
    return true;
}

// ---------------- Event Override ----------------

export async function loadDraftEventOverride(): Promise<PremiumEventOverride> {
    return safeParse<PremiumEventOverride>(localStorage.getItem(K.draftEvent)) ?? {};
}

export async function saveDraftEventOverride(v: PremiumEventOverride) {
    localStorage.setItem(K.draftEvent, JSON.stringify(v));
    return true;
}

export async function loadPublishedEventOverride(): Promise<PremiumEventOverride> {
    return safeParse<PremiumEventOverride>(localStorage.getItem(K.publishedEvent)) ?? {};
}

export async function publishEventOverride() {
    const draft = await loadDraftEventOverride();
    localStorage.setItem(K.publishedEvent, JSON.stringify(draft));
    return true;
}
