// noinspection DuplicatedCode

export const locationVerification: (longitude: string, latitude: string) =>
    Promise<boolean> = async (longitude: string, latitude: string): Promise<boolean>=> {
    if (longitude && latitude) {
        const campusBoLat: string | undefined = process.env.CAMPUS_BO_LAT;
        const campusBoLong: string | undefined = process.env.CAMPUS_BO_LONG;
        const maxDistance: number | undefined = Number(process.env.MAX_DISTANCE);

        // Sjekk om den er 10km innenfor campus bø
        const distance = calculateDistance(
            Number(latitude),
            Number(longitude),
            Number(campusBoLat),
            Number(campusBoLong)
        );

        if (distance > maxDistance) {
            console.log("Requesten kommer fra utenfor rekkevidden: " + distance);
            return false;
        }
    }
    return true;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI/180);
}