import { STORES } from "../../data/stores.js";
import { lookupZipCoordinates } from "./zipLookup.js";

export const SEARCH_RADIUS_MILES = 50;
const FALLBACK_RESULTS_COUNT = 3;
const EARTH_RADIUS_MILES = 3958.8;

export function distanceInMiles(from, to) {
    const toRadians = (value) => (value * Math.PI) / 180;
    const dLat = toRadians(to.lat - from.lat);
    const dLng = toRadians(to.lng - from.lng);
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(a));
}

function nearestByZipNumber(zip, stores) {
    const target = Number(zip);
    return [...stores]
        .sort((a, b) => Math.abs(Number(a.zip) - target) - Math.abs(Number(b.zip) - target))
        .slice(0, FALLBACK_RESULTS_COUNT)
        .map((store) => ({ ...store, distance: null }));
}

export async function searchStoresByZip(zip, { stores = STORES, lookupZip = lookupZipCoordinates } = {}) {
    let coordinates;

    try {
        coordinates = await lookupZip(zip);
    } catch {
        return { status: "offline", stores: nearestByZipNumber(zip, stores) };
    }

    if (!coordinates) {
        return { status: "unknown-zip", stores: [] };
    }

    const sorted = stores
        .map((store) => ({ ...store, distance: distanceInMiles(coordinates, store) }))
        .sort((a, b) => a.distance - b.distance);

    const nearby = sorted.filter((store) => store.distance <= SEARCH_RADIUS_MILES);

    if (nearby.length > 0) {
        return { status: "nearby", stores: nearby };
    }

    return { status: "none-nearby", stores: sorted.slice(0, FALLBACK_RESULTS_COUNT) };
}