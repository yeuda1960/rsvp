import React, { useEffect, useMemo, useState } from "react";
import type {
    PremiumEventOverride,
    PremiumInvitationConfig,
} from "../../premium-invitation/config/types";
import {
    loadDraftPremiumConfig,
    saveDraftPremiumConfig,
    publishPremiumConfig,
    resetPremiumConfigToDefault,
    loadDraftEventOverride,
    saveDraftEventOverride,
    publishEventOverride,
} from "../../premium-invitation/config/storage";
import { defaultPremiumInvitationConfig } from "../../premium-invitation/config/defaultConfig";

/**
 * Admin Designer page:
 * - Edits Draft premium config (copy/style/media)
 * - Edits Draft event override (date/time/venue/address/coords/deadline)
 * - Preview Draft button opens /admin/premium-invitation-preview
 * - Publish copies draft -> published (config + event override)
 *
 * NOTE: this file assumes you already protect /admin/* routes in your app.
 */

export default function AdminPremiumInvitationBuilder() {
    const [cfg, setCfg] = useState<PremiumInvitationConfig | null>(null);
    const [eventOverride, setEventOverride] = useState<PremiumEventOverride>({});
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    const publishedInviteLink = useMemo(() => "/invite/premium", []);

    useEffect(() => {
        (async () => {
            const dCfg = await loadDraftPremiumConfig();
            const dEvent = await loadDraftEventOverride();
            setCfg(dCfg ?? defaultPremiumInvitationConfig);
            setEventOverride(dEvent ?? {});
        })();
    }, []);

    // Real-time preview: send updates to iframe
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    // Update iframe code to use ref
    const previewDraftLink = useMemo(() => "/admin/premium-invitation-preview", []);

    useEffect(() => {
        if (iframeRef.current?.contentWindow && cfg) {
            iframeRef.current.contentWindow.postMessage(
                { type: "PREVIEW_UPDATE", config: cfg, eventOverride },
                "*"
            );
        }
    }, [cfg, eventOverride]);

    if (!cfg) return <div className="p-10 bg-red-500 text-white">Loading…</div>;

    // ... existing save/publish logic ...

    const updateCfg = (patch: Partial<PremiumInvitationConfig>) =>
        setCfg({ ...cfg, ...patch });

    const updateRsvp = (key: keyof PremiumInvitationConfig["content"]["rsvp"], val: string) => {
        setCfg({
            ...cfg,
            content: {
                ...cfg.content,
                rsvp: { ...cfg.content.rsvp, [key]: val },
            },
        });
    };

    const saveDraft = async () => {
        setSaving(true);
        setMsg(null);

        const okCfg = await saveDraftPremiumConfig({
            ...cfg,
            publishState: {
                ...cfg.publishState,
                draftUpdatedAt: new Date().toISOString(),
            },
        });

        const okEvent = await saveDraftEventOverride(eventOverride);

        setSaving(false);
        setMsg(okCfg && okEvent ? "הטיוטה נשמרה בהצלחה." : "שגיאה בשמירת הטיוטה.");
    };

    const publish = async () => {
        setSaving(true);
        setMsg(null);

        // Ensure draft is saved first
        await saveDraft();

        const okCfg = await publishPremiumConfig();
        const okEvent = await publishEventOverride();

        setSaving(false);
        setMsg(okCfg && okEvent ? "פורסם בהצלחה." : "שגיאה בפרסום.");
    };

    const reset = async () => {
        setSaving(true);
        setMsg(null);

        const ok = await resetPremiumConfigToDefault();
        setSaving(false);

        if (ok) {
            setCfg(defaultPremiumInvitationConfig);
            setEventOverride({});
            setMsg("אופס למצב ברירת מחדל.");
        } else {
            setMsg("האיפוס נכשל.");
        }
    };

    return (
        <div className="min-h-screen p-6 md:p-12 font-sans text-stone-800 bg-[#fafaf9]" dir="rtl">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-medium text-stone-900">
                            עורך הזמנה דיגיטלית
                        </h1>
                        <div className="text-stone-500 mt-1">עריכת טיוטה • תצוגה מקדימה • פרסום</div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            className="px-5 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors text-sm font-medium shadow-sm"
                            onClick={reset}
                            disabled={saving}
                        >
                            איפוס
                        </button>
                        <button
                            className="px-5 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
                            onClick={saveDraft}
                            disabled={saving}
                        >
                            {saving ? "שומר..." : "שמירת טיוטה"}
                        </button>
                        <button
                            className="px-6 py-2.5 rounded-lg bg-stone-900 text-white hover:bg-black transition-colors text-sm font-medium shadow-md"
                            onClick={publish}
                            disabled={saving}
                        >
                            פרסום
                        </button>
                    </div>
                </div>

                <div className="flex gap-4 mb-6">
                    <a
                        className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-600 hover:bg-stone-50"
                        href={previewDraftLink}
                        target="_blank"
                        rel="noreferrer"
                    >
                        פתח תצוגה מקדימה לנייד ↗
                    </a>

                    <a
                        className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-600 hover:bg-stone-50"
                        href={publishedInviteLink}
                        target="_blank"
                        rel="noreferrer"
                    >
                        צפה בהזמנה המפורסמת ↗
                    </a>
                </div>

                {msg ? (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-100 flex items-center gap-2">
                        <span className="text-lg">✓</span> {msg}
                    </div>
                ) : null}

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
                    {/* LEFT: Editor */}
                    <div className="bg-white border border-black/10 rounded-2xl p-5">
                        <h2 className="font-semibold text-xl mb-4 text-stone-900 border-b border-stone-100 pb-2">תוכן ההזמנה</h2>

                        <Field label="שמות הזוג" description="השמות כפי שיפיעו בכותרת הראשית (למשל: שירה ודניאל).">
                            <input
                                className="w-full border border-black/10 rounded-xl px-4 py-3"
                                value={cfg.content.coupleNames}
                                onChange={(e) =>
                                    updateCfg({
                                        content: { ...cfg.content, coupleNames: e.target.value },
                                    })
                                }
                            />
                        </Field>

                        <Field label="ראשי תיבות (מונוגרמה)" description="יופיעו בלוגו הפתיחה ובאנימציה. מומלץ 2-3 תווים באנגלית או עברית (למשל S&D).">
                            <input
                                className="w-full border border-black/10 rounded-xl px-4 py-3"
                                value={cfg.content.monogramInitials}
                                onChange={(e) =>
                                    updateCfg({
                                        content: { ...cfg.content, monogramInitials: e.target.value },
                                    })
                                }
                            />
                        </Field>

                        <Field label="כותרת קטנה (פתיח)" description="מופיע בקטן מעל השמות (למשל: You're Invited או ״שמחים להזמין אתכם״).">
                            <input
                                className="w-full border border-black/10 rounded-xl px-4 py-3"
                                value={cfg.content.introHeadline}
                                onChange={(e) =>
                                    updateCfg({
                                        content: { ...cfg.content, introHeadline: e.target.value },
                                    })
                                }
                            />
                        </Field>

                        <Field label="טקסט פתיחה / הזמנה" description="טקסט חופשי המופיע מתחת לכותרת. מקום לכתוב הקדשה אישית או ציטוט.">
                            <textarea
                                className="w-full border border-black/10 rounded-xl px-4 py-3 min-h-[96px]"
                                value={cfg.content.welcomeText}
                                onChange={(e) =>
                                    updateCfg({
                                        content: { ...cfg.content, welcomeText: e.target.value },
                                    })
                                }
                            />
                        </Field>

                        <h2 className="font-semibold text-xl mt-10 mb-4 text-stone-900 border-b border-stone-100 pb-2">פרטי האירוע (דריסה)</h2>
                        <div className="text-sm text-stone-500 mb-6 bg-stone-50 p-3 rounded-lg border border-stone-100">
                            <strong>שימו לב:</strong> הפרטים כאן דורסים את מה שמוגדר במערכת הכללית עבור הזמנה זו בלבד.
                            הם משפיעים גם על טופס אישור ההגעה (למשל תאריך סגירת הרשמה).
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Field label="תאריך (טקסט חופשי)" description="לדוגמה: 24.08.2025 או כ״ד באב.">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={eventOverride.dateText ?? ""}
                                    onChange={(e) =>
                                        setEventOverride({ ...eventOverride, dateText: e.target.value })
                                    }
                                />
                            </Field>

                            <Field label="שעה" description="לדוגמה: 19:30 קבלת פנים.">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={eventOverride.timeText ?? ""}
                                    onChange={(e) =>
                                        setEventOverride({ ...eventOverride, timeText: e.target.value })
                                    }
                                />
                            </Field>

                            <Field label="שם המקום" description="שם האולם או גן האירועים.">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={eventOverride.venueName ?? ""}
                                    onChange={(e) =>
                                        setEventOverride({ ...eventOverride, venueName: e.target.value })
                                    }
                                />
                            </Field>

                            <Field label="כתובת" description="כתובת מלאה לניווט בוויז.">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={eventOverride.addressText ?? ""}
                                    onChange={(e) =>
                                        setEventOverride({ ...eventOverride, addressText: e.target.value })
                                    }
                                />
                            </Field>

                            <Field label="קישור לניווט ב-Waze" description="העתיקו והדביקו קישור מלא מוויז (שתף מיקום).">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3 text-left"
                                    style={{ direction: 'ltr' }}
                                    placeholder="https://waze.com/ul?ll=..."
                                    value={eventOverride.wazeLink ?? ""}
                                    onChange={(e) =>
                                        setEventOverride({ ...eventOverride, wazeLink: e.target.value })
                                    }
                                />
                            </Field>

                            <Field label="קישור לניווט ב-Google Maps" description="העתיקו והדביקו קישור מלא מגוגל מפות.">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3 text-left"
                                    style={{ direction: 'ltr' }}
                                    placeholder="https://maps.google.com/..."
                                    value={eventOverride.mapsLink ?? ""}
                                    onChange={(e) =>
                                        setEventOverride({ ...eventOverride, mapsLink: e.target.value })
                                    }
                                />
                            </Field>

                            <Field label="הערות נוספות" description="מידע על הסעות, חניה וכו׳.">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={eventOverride.notes ?? ""}
                                    onChange={(e) =>
                                        setEventOverride({ ...eventOverride, notes: e.target.value })
                                    }
                                />
                            </Field>
                        </div>

                        <h2 className="font-semibold text-xl mt-10 mb-4 text-stone-900 border-b border-stone-100 pb-2">עיצוב וסגנון</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Field label="גופן כותרות" description="הפונט הראשי לכותרות הגדולות.">
                                <select
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={cfg.style.headingFont}
                                    onChange={(e) =>
                                        updateCfg({
                                            style: { ...cfg.style, headingFont: e.target.value as any },
                                        })
                                    }
                                >
                                    <option value="Playfair Display">Playfair Display (Serif)</option>
                                    <option value="Cormorant Garamond">Cormorant Garamond (Serif)</option>
                                    <option value="Assistant">Assistant (Sans)</option>
                                    <option value="Rubik">Rubik (Sans)</option>
                                    <option value="Amatic SC">Amatic SC (Handwritten)</option>
                                </select>
                            </Field>

                            <Field label="גופן טקסט רץ" description="הפונט לטקסטים הקטנים יותר.">
                                <select
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={cfg.style.bodyFont}
                                    onChange={(e) =>
                                        updateCfg({
                                            style: { ...cfg.style, bodyFont: e.target.value as any },
                                        })
                                    }
                                >
                                    <option value="Inter">Inter</option>
                                    <option value="Assistant">Assistant</option>
                                    <option value="Rubik">Rubik</option>
                                    <option value="Amatic SC">Amatic SC</option>
                                </select>
                            </Field>

                            <Field label="צבע ראשי (טקסט)" description="צבע הטקסט הראשי (מומלץ כהה).">
                                <input
                                    type="color"
                                    className="w-full border border-black/10 rounded-xl px-2 py-2 h-12"
                                    value={cfg.style.primaryColor}
                                    onChange={(e) =>
                                        updateCfg({
                                            style: { ...cfg.style, primaryColor: e.target.value },
                                        })
                                    }
                                />
                            </Field>

                            <Field label="צבע דגש (Accent)" description="לכותרות משנה, כפתורים וקישוטים.">
                                <input
                                    type="color"
                                    className="w-full border border-black/10 rounded-xl px-2 py-2 h-12"
                                    value={cfg.style.secondaryColor}
                                    onChange={(e) =>
                                        updateCfg({
                                            style: { ...cfg.style, secondaryColor: e.target.value },
                                        })
                                    }
                                />
                            </Field>

                            <Field label="טקסטורת רקע" description="מרקם עדין שיופיע ברקע ההזמנה.">
                                <select
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={cfg.style.texture}
                                    onChange={(e) =>
                                        updateCfg({
                                            style: { ...cfg.style, texture: e.target.value as any },
                                        })
                                    }
                                >
                                    <option value="none">ללא</option>
                                    <option value="paper">נייר (Paper)</option>
                                    <option value="linen">בד (Linen)</option>
                                </select>
                            </Field>

                            <Field label="רדיוס פינות (כרטיס)" description="עגלגלות הכרטיסים (בפיקסלים).">
                                <input
                                    type="number"
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={cfg.style.cardRadiusPx}
                                    onChange={(e) =>
                                        updateCfg({
                                            style: { ...cfg.style, cardRadiusPx: Number(e.target.value) },
                                        })
                                    }
                                />
                            </Field>

                            <Field label="מידת ריווח" description="צפיפות האלמנטים בהזמנה.">
                                <select
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={cfg.style.spacing}
                                    onChange={(e) =>
                                        updateCfg({
                                            style: { ...cfg.style, spacing: e.target.value as any },
                                        })
                                    }
                                >
                                    <option value="comfortable">מרווח (Comfortable)</option>
                                    <option value="compact">צפוף (Compact)</option>
                                </select>
                            </Field>

                            <Field label="סגנון כפתורים" description="המראה של כפתורי הפעולה וה-RSVP.">
                                <select
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={cfg.style.buttonStyle}
                                    onChange={(e) =>
                                        updateCfg({
                                            style: { ...cfg.style, buttonStyle: e.target.value as any },
                                        })
                                    }
                                >
                                    <option value="filled">מלא בצבע (Filled)</option>
                                    <option value="outline">קו מתאר בלבד (Outline)</option>
                                    <option value="rounded">עגול במיוחד (Rounded)</option>
                                </select>
                            </Field>
                        </div>

                        <h2 className="font-semibold text-xl mt-10 mb-4 text-stone-900 border-b border-stone-100 pb-2">טיפוגרפיה וגופנים</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Field label="גודל כותרות ראשיות (Hero)" description="שמות הזוג, כותרות גדולות (5-30)">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        min="5"
                                        max="30"
                                        className="w-full border border-black/10 rounded-xl px-4 py-3"
                                        value={Math.round((cfg.style.fontSize?.hero ?? 1.0) * 10)}
                                        onChange={(e) => updateCfg({ style: { ...cfg.style, fontSize: { ...cfg.style.fontSize!, hero: parseInt(e.target.value) / 10 } } })}
                                    />
                                </div>
                            </Field>

                            <Field label="גודל כותרת משנית (Intro)" description="טקסט מעל השמות 'מוזמנים לחתונה' (5-25)">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        min="5"
                                        max="25"
                                        className="w-full border border-black/10 rounded-xl px-4 py-3"
                                        value={Math.round((cfg.style.fontSize?.intro ?? 1.0) * 10)}
                                        onChange={(e) => updateCfg({ style: { ...cfg.style, fontSize: { ...cfg.style.fontSize!, intro: parseInt(e.target.value) / 10 } } })}
                                    />
                                </div>
                            </Field>

                            <Field label="גודל כותרות משנה" description="כותרות סקשנים (5-25)">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        min="5"
                                        max="25"
                                        className="w-full border border-black/10 rounded-xl px-4 py-3"
                                        value={Math.round((cfg.style.fontSize?.heading ?? 1.0) * 10)}
                                        onChange={(e) => updateCfg({ style: { ...cfg.style, fontSize: { ...cfg.style.fontSize!, heading: parseInt(e.target.value) / 10 } } })}
                                    />
                                </div>
                            </Field>

                            <Field label="גודל טקסט רץ (Body)" description="פסקה, תיאורים (5-20)">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        min="5"
                                        max="20"
                                        className="w-full border border-black/10 rounded-xl px-4 py-3"
                                        value={Math.round((cfg.style.fontSize?.body ?? 1.0) * 10)}
                                        onChange={(e) => updateCfg({ style: { ...cfg.style, fontSize: { ...cfg.style.fontSize!, body: parseInt(e.target.value) / 10 } } })}
                                    />
                                </div>
                            </Field>

                            <Field label="גודל טקסט קטן" description="תוויות, הערות (5-20)">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="number"
                                        min="5"
                                        max="20"
                                        className="w-full border border-black/10 rounded-xl px-4 py-3"
                                        value={Math.round((cfg.style.fontSize?.small ?? 1.0) * 10)}
                                        onChange={(e) => updateCfg({ style: { ...cfg.style, fontSize: { ...cfg.style.fontSize!, small: parseInt(e.target.value) / 10 } } })}
                                    />
                                </div>
                            </Field>
                        </div>

                        <h2 className="font-semibold text-xl mt-10 mb-4 text-stone-900 border-b border-stone-100 pb-2">מדיה ופתיח</h2>

                        <Field label="סוג אנימציית פתיחה" description="מה יוצג במסך הכניסה לפני שהאורח לוחץ לפתיחה.">
                            <select
                                className="w-full border border-black/10 rounded-xl px-4 py-3"
                                value={cfg.media.opening.type}
                                onChange={(e) => {
                                    const type = e.target.value as "none" | "video" | "lottie";
                                    updateCfg({
                                        media: {
                                            ...cfg.media,
                                            opening: type === "none" ? { type: "none" } : { type, url: "" },
                                        },
                                    });
                                }}
                            >
                                <option value="none">ללא (מונוגרמה בלבד)</option>
                                <option value="video">וידאו (MP4)</option>
                                <option value="lottie">אנימציית Lottie (JSON)</option>
                            </select>
                        </Field>



                        <Field label="גיף רקע (Hero Background)" description="יופיע ברקע של החלק הראשון (הכותרת).">
                            <input
                                className="w-full border border-black/10 rounded-xl px-4 py-3"
                                placeholder="/header-bg.gif"
                                style={{ direction: 'ltr' }}
                                value={cfg.media.heroGifUrl || ""}
                                onChange={(e) =>
                                    updateCfg({
                                        media: {
                                            ...cfg.media,
                                            heroGifUrl: e.target.value,
                                        },
                                    })
                                }
                            />
                        </Field>

                        <Field label="גודל הגיף (Zoom)" description="שינוי גודל התצוגה של הגיף (0.5 = התרחקות, 2.0 = התקרבות)">
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2.0"
                                    step="0.1"
                                    className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                                    value={cfg.media.heroGifScale ?? 1.1}
                                    onChange={(e) =>
                                        updateCfg({
                                            media: {
                                                ...cfg.media,
                                                heroGifScale: Number(e.target.value),
                                            },
                                        })
                                    }
                                />
                                <span className="text-stone-500 w-12 text-center text-sm font-mono">
                                    {(cfg.media.heroGifScale ?? 1.1).toFixed(1)}x
                                </span>
                            </div>
                        </Field>

                        {/* Video URL input hidden as per user request - hardcoded in default config */}
                        {/* {cfg.media.opening.type !== "none" && (
                            <Field label={`${cfg.media.opening.type === "video" ? "קישור לוידאו" : "קישור ל-JSON"}`} description="הדביקו כאן את הלינק לקובץ המדיה.">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={cfg.media.opening.url}
                                    onChange={(e) =>
                                        updateCfg({
                                            media: {
                                                ...cfg.media,
                                                opening: { ...cfg.media.opening, url: e.target.value } as any,
                                            },
                                        })
                                    }
                                    placeholder="https://..."
                                    style={{ direction: 'ltr' }}
                                />
                            </Field>
                        )} */}

                        <Field label="מוזיקת רקע" description="תימן אוטומטית כשהאורח יבצע אינטראקציה ראשונה.">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={cfg.media.audio.enabled}
                                    onChange={(e) => {
                                        updateCfg({
                                            media: {
                                                ...cfg.media,
                                                audio: e.target.checked
                                                    ? {
                                                        enabled: true,
                                                        url: "",
                                                        startTimeSec: 0,
                                                        volume: 0.6,
                                                        fadeInMs: 2500,
                                                    }
                                                    : { enabled: false },
                                            },
                                        });
                                    }}
                                />
                                <span className="text-sm">הפעל מוזיקת רקע</span>
                            </div>
                        </Field>

                        {cfg.media.audio.enabled && (
                            <>
                                {/* Audio URL input hidden as per user request */}
                                {/* <Field label="קישור לקובץ (MP3)" description="לינק ישיר לקובץ אודיו.">
                                    <input
                                        className="w-full border border-black/10 rounded-xl px-4 py-3"
                                        value={cfg.media.audio.url}
                                        onChange={(e) =>
                                            updateCfg({
                                                media: {
                                                    ...cfg.media,
                                                    audio: { ...cfg.media.audio, url: e.target.value } as any,
                                                },
                                            })
                                        }
                                        placeholder="https://..."
                                        style={{ direction: 'ltr' }}
                                    />
                                </Field> */}

                                <div className="grid grid-cols-3 gap-3">
                                    <Field label="התחלה משניה" description="דלג על ההתחלה.">
                                        <input
                                            type="number"
                                            className="w-full border border-black/10 rounded-xl px-4 py-3"
                                            value={cfg.media.audio.enabled ? cfg.media.audio.startTimeSec : 0}
                                            onChange={(e) =>
                                                updateCfg({
                                                    media: {
                                                        ...cfg.media,
                                                        audio: {
                                                            ...cfg.media.audio,
                                                            startTimeSec: Number(e.target.value),
                                                        } as any,
                                                    },
                                                })
                                            }
                                        />
                                    </Field>

                                    <Field label="עוצמה (0-1)" description="0.5 זה חצי עוצמה.">
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="1"
                                            className="w-full border border-black/10 rounded-xl px-4 py-3"
                                            value={cfg.media.audio.enabled ? cfg.media.audio.volume : 0.6}
                                            onChange={(e) =>
                                                updateCfg({
                                                    media: {
                                                        ...cfg.media,
                                                        audio: {
                                                            ...cfg.media.audio,
                                                            volume: Number(e.target.value),
                                                        } as any,
                                                    },
                                                })
                                            }
                                        />
                                    </Field>

                                    <Field label="Fade In (מילישניות)" description="כניסה הדרגתית.">
                                        <input
                                            type="number"
                                            className="w-full border border-black/10 rounded-xl px-4 py-3"
                                            value={cfg.media.audio.enabled ? cfg.media.audio.fadeInMs : 2500}
                                            onChange={(e) =>
                                                updateCfg({
                                                    media: {
                                                        ...cfg.media,
                                                        audio: {
                                                            ...cfg.media.audio,
                                                            fadeInMs: Number(e.target.value),
                                                        } as any,
                                                    },
                                                })
                                            }
                                        />
                                    </Field>
                                </div>
                            </>
                        )}

                        <h2 className="font-semibold text-xl mt-10 mb-4 text-stone-900 border-b border-stone-100 pb-2">כפתורים וטקסטים (RSVP)</h2>
                        <div className="text-sm text-stone-500 mb-6 bg-stone-50 p-3 rounded-lg border border-stone-100">
                            <strong>התאמה אישית:</strong> שינוי הטקסטים בכפתורים ובהודעות המערכת.
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                            <Field label="כפתור פתיחת אישור הגעה">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={cfg.content.rsvp.openButton}
                                    onChange={(e) => updateCfg({ content: { ...cfg.content, rsvp: { ...cfg.content.rsvp, openButton: e.target.value } } })}
                                />
                            </Field>
                            <Field label="טקסט כפתור דילוג (וידאו)">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={cfg.content.labels.skipButton || "דלג / כניסה לאתר"}
                                    onChange={(e) => updateCfg({ content: { ...cfg.content, labels: { ...cfg.content.labels, skipButton: e.target.value } } })}
                                />
                            </Field>
                            <Field label="רמז לביטול השתקה (וידאו)">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={cfg.content.labels.tapToUnmute || "לחץ לביטול השתקה"}
                                    onChange={(e) => updateCfg({ content: { ...cfg.content, labels: { ...cfg.content.labels, tapToUnmute: e.target.value } } })}
                                />
                            </Field>
                            <Field label="רמז באנימציית גלילה">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={cfg.content.labels.scrollHint || "גלול למטה"}
                                    onChange={(e) => updateCfg({ content: { ...cfg.content, labels: { ...cfg.content.labels, scrollHint: e.target.value } } })}
                                />
                            </Field>
                            <Field label="מוזיקה תתנגן (חיווי)">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3"
                                    value={cfg.content.labels.musicPlayHint || "המוזיקה תתנגן"}
                                    onChange={(e) => updateCfg({ content: { ...cfg.content, labels: { ...cfg.content.labels, musicPlayHint: e.target.value } } })}
                                />
                            </Field>

                        </div>

                        <Field label="כפתור 'שלח אישור'">
                            <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.submit} onChange={(e) => updateRsvp("submit", e.target.value)} />
                        </Field>
                        <Field label="כפתור 'המשך'">
                            <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.stepNext} onChange={(e) => updateRsvp("stepNext", e.target.value)} />
                        </Field>
                        <Field label="כפתור 'חזור'">
                            <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.stepBack} onChange={(e) => updateRsvp("stepBack", e.target.value)} />
                        </Field>
                        <Field label="כפתור 'עריכת תשובה'">
                            <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.editResponse} onChange={(e) => updateRsvp("editResponse", e.target.value)} />
                        </Field>


                        <div className="w-full h-[1px] bg-stone-200 my-8" />
                        <h4 className="font-bold text-stone-700 mb-4">תרגום טופס (שאלות)</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Field label="שאלת הגעה ראשית">
                                <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.questionAttending || ""} onChange={(e) => updateRsvp("questionAttending", e.target.value)} />
                            </Field>
                            <div className="grid grid-cols-2 gap-2">
                                <Field label="תשובה חיובית (כן)">
                                    <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.yesOption || ""} onChange={(e) => updateRsvp("yesOption", e.target.value)} />
                                </Field>
                                <Field label="תשובה שלילית (לא)">
                                    <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.noOption || ""} onChange={(e) => updateRsvp("noOption", e.target.value)} />
                                </Field>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            <Field label="שאלת כמות אורחים">
                                <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.questionGuests || ""} onChange={(e) => updateRsvp("questionGuests", e.target.value)} />
                            </Field>
                            <Field label="תת-כותרת (כולל אותך)">
                                <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.guestsSubtitle || ""} onChange={(e) => updateRsvp("guestsSubtitle", e.target.value)} />
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mt-3">
                            <Field label="כותרת שלב אחרון">
                                <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.questionFinal || ""} onChange={(e) => updateRsvp("questionFinal", e.target.value)} />
                            </Field>
                            <Field label="Placeholder רגישויות">
                                <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.dietaryPlaceholder || ""} onChange={(e) => updateRsvp("dietaryPlaceholder", e.target.value)} />
                            </Field>
                            <Field label="Placeholder ברכה לזוג">
                                <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.notesPlaceholder || ""} onChange={(e) => updateRsvp("notesPlaceholder", e.target.value)} />
                            </Field>
                        </div>

                        <h4 className="font-bold text-stone-700 mb-4 mt-6">הגדרות ילדים (RSVP)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                            <Field label="תווית צ'ק בוקס ילדים">
                                <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.childrenCheckboxLabel || ""} onChange={(e) => updateRsvp("childrenCheckboxLabel", e.target.value)} />
                            </Field>
                            <Field label="הערות למיקום">
                                <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={eventOverride.notes || ""} onChange={(e) => setEventOverride({ ...eventOverride, notes: e.target.value })} />
                            </Field>
                            <Field label="קישור ל-Waze">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3 text-left"
                                    placeholder="https://waze.com/ul/..."
                                    value={eventOverride.wazeLink || ""}
                                    onChange={(e) => setEventOverride({ ...eventOverride, wazeLink: e.target.value })}
                                />
                            </Field>
                            <Field label="קישור ל-Google Maps">
                                <input
                                    className="w-full border border-black/10 rounded-xl px-4 py-3 text-left"
                                    placeholder="https://maps.app.goo.gl/..."
                                    value={eventOverride.mapsLink || ""}
                                    onChange={(e) => setEventOverride({ ...eventOverride, mapsLink: e.target.value })}
                                />
                            </Field>
                            <Field label="תווית כמות ילדים">
                                <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.childrenCountLabel || ""} onChange={(e) => updateRsvp("childrenCountLabel", e.target.value)} />
                            </Field>
                        </div>

                        <h4 className="font-bold text-stone-700 mb-4 mt-6">אישור שלילי (לא מגיעים)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                            <Field label="כותרת אישור שלילי">
                                <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.notAttendingTitle || ""} onChange={(e) => updateRsvp("notAttendingTitle", e.target.value)} />
                            </Field>
                            <Field label="טקסט הסבר (גוף)">
                                <textarea className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.notAttendingBody || ""} onChange={(e) => updateRsvp("notAttendingBody", e.target.value)} />
                            </Field>
                            <Field label="כפתור שליחה (שלילי)">
                                <input className="w-full border border-black/10 rounded-xl px-4 py-3" value={cfg.content.rsvp.notAttendingSubmit || ""} onChange={(e) => updateRsvp("notAttendingSubmit", e.target.value)} />
                            </Field>
                        </div>

                        <Field label="כותרת תודה">
                            <input
                                className="w-full border border-black/10 rounded-xl px-4 py-3"
                                value={cfg.content.thankYou.title}
                                onChange={(e) =>
                                    updateCfg({
                                        content: {
                                            ...cfg.content,
                                            thankYou: { ...cfg.content.thankYou, title: e.target.value },
                                        },
                                    })
                                }
                            />
                        </Field>

                        <Field label="טקסט תודה">
                            <textarea
                                className="w-full border border-black/10 rounded-xl px-4 py-3 min-h-[80px]"
                                value={cfg.content.thankYou.body}
                                onChange={(e) =>
                                    updateCfg({
                                        content: {
                                            ...cfg.content,
                                            thankYou: { ...cfg.content.thankYou, body: e.target.value },
                                        },
                                    })
                                }
                            />
                        </Field>

                        <Field label="הודעת הרשמה נסגרה">
                            <input
                                className="w-full border border-black/10 rounded-xl px-4 py-3"
                                value={cfg.content.thankYou.deadlinePassed}
                                onChange={(e) =>
                                    updateCfg({
                                        content: {
                                            ...cfg.content,
                                            thankYou: { ...cfg.content.thankYou, deadlinePassed: e.target.value },
                                        },
                                    })
                                }
                            />
                        </Field>

                        <Field label="טקסט תחתון (קרדיט/זוג)">
                            <input
                                className="w-full border border-black/10 rounded-xl px-4 py-3"
                                value={cfg.content.footerText}
                                onChange={(e) =>
                                    updateCfg({
                                        content: { ...cfg.content, footerText: e.target.value },
                                    })
                                }
                            />
                        </Field>
                    </div>

                    {/* RIGHT: preview frame */}
                    <div className="sticky top-6 self-start pl-8 hidden lg:block">
                        <div className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4 text-center">
                            Mobile Preview
                        </div>

                        {/* Phone Bezel */}
                        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[800px] w-[390px] shadow-2xl">
                            <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                            <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative">
                                <iframe
                                    ref={iframeRef}
                                    title="Draft preview"
                                    src={previewDraftLink}
                                    className="w-full h-full border-none"
                                />
                                {/* Overlay to prevent interaction if needed, or just let it be interactive */}
                            </div>
                        </div>

                        <div className="text-center mt-6">
                            <a
                                href={previewDraftLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-wider"
                            >
                                Open in new tab ↗
                            </a>
                        </div>
                    </div>
                </div>

                {
                    saving ? (
                        <div className="fixed bottom-6 right-6 bg-stone-900 text-white px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2 animate-pulse">
                            Saving...
                        </div>
                    ) : null
                }
            </div >
        </div >
    );
}

function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
    return (
        <div className="mb-6 last:mb-0">
            <div className="text-sm font-medium text-stone-700 mb-1.5">{label}</div>
            <div className="[&>input]:w-full [&>input]:border [&>input]:border-stone-200 [&>input]:rounded-lg [&>input]:px-4 [&>input]:py-3 [&>input]:bg-stone-50 [&>input]:text-stone-900 [&>input]:placeholder-stone-400 [&>input]:transition-all [&>input]:focus:bg-white [&>input]:focus:border-stone-400 [&>input]:focus:ring-0 [&>input]:outline-none [&>textarea]:w-full [&>textarea]:border [&>textarea]:border-stone-200 [&>textarea]:rounded-lg [&>textarea]:px-4 [&>textarea]:py-3 [&>textarea]:bg-stone-50 [&>textarea]:text-stone-900 [&>textarea]:placeholder-stone-400 [&>textarea]:transition-all [&>textarea]:focus:bg-white [&>textarea]:focus:border-stone-400 [&>textarea]:focus:ring-0 [&>textarea]:outline-none [&>select]:w-full [&>select]:border [&>select]:border-stone-200 [&>select]:rounded-lg [&>select]:px-4 [&>select]:py-3 [&>select]:bg-stone-50 [&>select]:text-stone-900 [&>select]:outline-none [&>select]:focus:bg-white [&>select]:focus:border-stone-400">
                {children}
            </div>
            {description && (
                <div className="text-xs text-stone-500 mt-1.5 leading-relaxed max-w-prose">
                    {description}
                </div>
            )}
        </div>
    );
}
