import { PremiumInvitationConfig } from "./types";

export const defaultPremiumInvitationConfig: PremiumInvitationConfig = {
    version: 1,

    content: {
        coupleNames: "שירה ודניאל",
        monogramInitials: "S & D",
        introHeadline: "You're Invited",
        welcomeText:
            "נשמח מאוד לראותכם חוגגים איתנו את היום המאושר בחיינו.",

        labels: {
            date: "התאריך",
            time: "בשעה",
            venue: "המקום",
            address: "כתובת",
            dressCode: "קוד לבוש",
            notes: "הערות",
            scrollHint: "גלול למטה",
            musicPlayHint: "המוזיקה תתנגן",
            tapToUnmute: "לחץ לביטול השתקה",
            skipButton: "דלג / כניסה לאתר",
        },

        rsvp: {
            openButton: "אישור הגעה",
            stepNext: "המשך",
            stepBack: "חזור",
            submit: "שלח אישור",
            editResponse: "ערוך תשובה",

            questionAttending: "האם תגיעו לחגוג איתנו?",
            yesOption: "כן, מגיעים!",
            noOption: "לצערי לא",
            questionGuests: "כמה אורחים תהיו?",
            guestsSubtitle: "כולל אותך",
            questionFinal: "פרטים אחרונים",
            dietaryPlaceholder: "רגישויות או בקשות מיוחדות למנות (אופציונלי)",
            notesPlaceholder: "", // Cleared per user request

            notAttendingTitle: "נצטער שלא תגיעו",
            notAttendingBody: "נשמח אם תאשרו סופית כדי שנדע להיערך.",
            notAttendingSubmit: "שלח אישורי (לא מגיע/ה)",

            childrenCheckboxLabel: "האם זה כולל ילדים?",
            childrenCountLabel: "כמה ילדים?",
        },

        thankYou: {
            title: "תודה רבה!",
            body: "שמחנו לקבל את אישורכם. נתראה בחתונה!",
            deadlinePassed: "ההרשמה לאירוע הסתיימה.",
        },

        footerText: "באהבה • שירה ודניאל",
        sectionOrder: ["hero", "welcome", "eventDetails", "rsvp", "footer"],
    },

    media: {
        opening: {
            type: "video",
            url: "/premium/intro/weddinenv.mp4"
        },
        audio: {
            enabled: true,
            url: "/audio/All_You_Need_Is_Love-104256-mobiles24.mp3",
            startTimeSec: 0,
            volume: 0.6,
            fadeInMs: 2500,
        },
        heroGifUrl: "",
        heroGifScale: 1.1,
    },

    style: {
        headingFont: "Playfair Display",
        bodyFont: "Inter",
        primaryColor: "#1A1A1A",
        secondaryColor: "#B08D57",
        texture: "paper",
        cardRadiusPx: 18,
        spacing: "comfortable",
        buttonStyle: "filled",
        fontSize: {
            hero: 1.0,
            heading: 1.0,
            body: 1.0,
            small: 1.0,
            intro: 1.0,
        },
    },

    publishState: {
        draftUpdatedAt: new Date().toISOString(),
        publishedUpdatedAt: new Date().toISOString(),
    },
};
