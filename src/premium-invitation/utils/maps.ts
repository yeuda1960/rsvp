/**
 * Very small helpers to generate navigation URLs
 * without adding dependencies.
 */

const enc = encodeURIComponent;

export function isIOS(): boolean {
    if (typeof navigator === "undefined") return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

type Dest = {
    lat?: number;
    lng?: number;
    address?: string;
};

export function buildGoogleMapsUrl(dest: Dest): string {
    if (dest.lat != null && dest.lng != null) {
        return `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${enc(
        dest.address ?? ""
    )}`;
}

export function buildWazeUrl(dest: Dest): string {
    if (dest.lat != null && dest.lng != null) {
        return `https://waze.com/ul?ll=${dest.lat}%2C${dest.lng}&navigate=yes`;
    }
    return `https://waze.com/ul?q=${enc(dest.address ?? "")}&navigate=yes`;
}

export function buildAppleMapsUrl(dest: Dest): string {
    if (dest.lat != null && dest.lng != null) {
        return `https://maps.apple.com/?daddr=${dest.lat},${dest.lng}`;
    }
    return `https://maps.apple.com/?daddr=${enc(dest.address ?? "")}`;
}
