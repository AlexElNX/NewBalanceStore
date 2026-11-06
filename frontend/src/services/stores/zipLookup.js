const ZIP_API_URL = "https://api.zippopotam.us/us";

export async function lookupZipCoordinates(zip) {
    const response = await fetch(`${ZIP_API_URL}/${zip}`);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("ZIP lookup failed");
    }

    const data = await response.json();
    const place = data.places?.[0];
    return place ? { lat: Number(place.latitude), lng: Number(place.longitude) } : null;
}