import { useEffect, useState } from "react";
import { PremiumInvitationConfig } from "./types";
import { loadPublishedPremiumConfig } from "./storage";

export function usePremiumInvitationConfig() {
    const [config, setConfig] = useState<PremiumInvitationConfig | null>(null);

    useEffect(() => {
        loadPublishedPremiumConfig().then(setConfig);
    }, []);

    return {
        config,
        loading: !config,
    };
}
