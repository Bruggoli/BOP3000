// Fått hjelp av Claude-AI til denne koden

import { useEffect, useState } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {JSONObject} from "@expo/json-file";

// Campus bø-koordinater
// TODO: flytt fra hardcodet til database-entry
const CAMPUS_BO_LAT = 59.40915252310901;
const CAMPUS_BO_LONG = 9.059592639906425;
const MAX_DISTANCE_KM = 10; // Maks avstand i kilometer

export function LocationComp() {
    const [locationStatus, setLocationStatus] = useState<string | null>(null);
    const [isWithinCampus, setIsWithinCampus] = useState<boolean>(false);

    useEffect(() => {
        async function getCurrentLocation(): Promise<void> {
            let status: Location.LocationPermissionResponse = await Location.requestForegroundPermissionsAsync();

            if (status.status !== 'granted') {
                setLocationStatus('Permission to access location was denied');
                router.replace("/terms-of-service");
                return;
            }

            try {
                // henter posisjon med spesifisert nøyaktighet
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced
                });

                // Regner ut avstand fra campus bø
                const distance: number = calculateDistance(
                    location.coords.latitude,
                    location.coords.longitude,
                    CAMPUS_BO_LAT,
                    CAMPUS_BO_LONG
                );

                const withinDistance: boolean = distance <= MAX_DISTANCE_KM;
                setIsWithinCampus(withinDistance);

                // Add distance and within flag to location data
                const locationWithDistance = {
                    distanceFromCampus: distance,
                    isWithinCampus: withinDistance
                };

                await setLocationData(locationWithDistance);

                if (!withinDistance) {
                    setLocationStatus(`Du er ${distance.toFixed(1)}km fra campus. Maks-grense er ${MAX_DISTANCE_KM}km.
                    Din posisjon: ${location.coords.latitude}, ${location.coords.longitude}
                    Campus: ${CAMPUS_BO_LAT}, ${CAMPUS_BO_LONG}`);
                } else {
                    setLocationStatus(`Du er ${distance.toFixed(1)}km fra campus.
                    Din posisjon: ${location.coords.latitude}, ${location.coords.longitude}
                    Campus: ${CAMPUS_BO_LAT}, ${CAMPUS_BO_LONG}`);
                }
            } catch (error) {
                console.error("Error getting location:", error);
                setLocationStatus('Error getting location');
            }
        }

        getCurrentLocation();
    }, []);

    console.log(`location status: ${locationStatus}`);

    return { locationStatus, isWithinCampus };
}

// Myyye hjelp fra claude med denne
// Calculate distance between two coordinates using the Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    // Returns distance in kilometers
    return R * c;
}

function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI/180);
}

const setLocationData = async (locationData: any): Promise<void> => {
    if (locationData === null) {
        throw Error("location not found location is null");
    }
    try {
        await AsyncStorage.setItem("location", JSON.stringify(locationData));
    } catch (e) {
        console.error("Error storing data:", e);
    }
};
// kan bruke ts-ignore her fordi vi bruker en assert
// @ts-ignore
export const getLocationData: () => Promise<locationWithDistance> = async (): Promise<locationWithDistance> => {
    try {
        const value = await AsyncStorage.getItem("location");
        // sjekker om verdien er en string
        assertIsValidData(value);
        console.log("getLocationData value:" + value);
        return  JSON.parse(value);
    } catch (e: any) {
        console.error("Error getting location data: " + e.toString());
    }
}

function assertIsValidData(value: unknown): asserts value is string {
    if (typeof value !== "string") throw new Error('value is not a string');
}