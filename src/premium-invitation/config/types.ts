export type ButtonStyle = "filled" | "outline" | "rounded";
export type SpacingDensity = "comfortable" | "compact";
export type Texture = "none" | "paper" | "linen";

export type OpeningAsset =
    | { type: "none" }
    | { type: "video"; url: string }
    | { type: "lottie"; url: string };

export type AudioAsset =
    | { enabled: false }
    | {
        enabled: true;
        url: string;
        startTimeSec: number;
        volume: number;
        fadeInMs: number;
    };

export type SectionKey =
    | "hero"
    | "welcome"
    | "eventDetails"
    | "rsvp"
    | "footer";

export type PremiumInvitationConfig = {
    version: number;

    content: {
        coupleNames: string;
        monogramInitials: string;
        introHeadline: string;
        welcomeText: string;

        labels: {
            date: string;
            time: string;
            venue: string;
            address: string;
            dressCode: string;
            notes: string;
            // New labels for full editability
            scrollHint: string;
            musicPlayHint: string;
            tapToUnmute: string;
            skipButton: string;
        };

        rsvp: {
            openButton: string;
            stepNext: string;
            stepBack: string;
            submit: string;
            editResponse: string;

            // New translated fields
            questionAttending: string;
            yesOption: string;
            noOption: string;
            questionGuests: string;
            guestsSubtitle: string;
            questionFinal: string;
            dietaryPlaceholder: string;
            notesPlaceholder: string;

            // New fields for User Feedback Round 2
            notAttendingTitle: string;
            notAttendingBody: string;
            notAttendingSubmit: string;
            childrenCheckboxLabel: string;
            childrenCountLabel: string;
        };

        thankYou: {
            title: string;
            body: string;
            deadlinePassed: string;
        };

        footerText: string;
        sectionOrder: SectionKey[];
    };

    media: {
        opening: OpeningAsset;
        audio: AudioAsset;
        heroGifUrl?: string;
        heroGifScale?: number;
    };

    style: {
        headingFont: "Playfair Display" | "Cormorant Garamond" | "Assistant" | "Rubik" | "Amatic SC";
        bodyFont: "Inter" | "Source Sans 3" | "Assistant" | "Rubik" | "Amatic SC";
        primaryColor: string;
        secondaryColor: string;
        texture: Texture;
        cardRadiusPx: number;
        spacing: SpacingDensity;
        buttonStyle: ButtonStyle;
        fontSize: {
            hero: number;
            heading: number;
            body: number;
            small: number;
            intro: number;
        };
    };

    publishState: {
        draftUpdatedAt: string;
        publishedUpdatedAt: string;
    };
};

export type PremiumEventOverride = {
    dateText?: string;
    timeText?: string;
    venueName?: string;
    addressText?: string;
    notes?: string;
    dressCode?: string;
    lat?: number;
    lng?: number;
    rsvpDeadlineIso?: string;
    wazeLink?: string;
    mapsLink?: string;
};
