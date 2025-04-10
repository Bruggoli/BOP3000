// Fått hjelp av Claude-AI til denne koden

import { useEffect, useState } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {JSONObject} from "@expo/json-file";

// Campus bø-koordinater
// TODO: flytt fra hardcodet til database-entry
const CAMPUS_BO_LAT = process.env.EXPO_PUBLIC_CAMPUS_BO_LAT;
const CAMPUS_BO_LONG = process.env.EXPO_PUBLIC_CAMPUS_BO_LONG;
const MAX_DISTANCE_KM = 10; // Maks avstand i kilometer

export function useLocation() {
    const [locationStatus, setLocationStatus] = useState<string | null>(null);
    const [isWithinCampus, setIsWithinCampus] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        async function getCurrentLocation() {
            let startTime = performance.now();
            let status: Location.LocationPermissionResponse = await Location.requestForegroundPermissionsAsync();

            if (status.status !== 'granted') {
                setLocationStatus('Permission to access location was denied');
                // TODO: redirecte til dedikert side?
                router.replace("/terms-of-service");
                setIsLoading(false);
                return;
            }
            let endTime = performance.now();
            console.log("tid på å hente permission: " + (endTime - startTime));

            try {
                // henter posisjon med spesifisert nøyaktighet
                console.log("henter posisjon");
                startTime = performance.now();
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced
                });
                endTime = performance.now();
                console.log("ferdig å hente posisjon, tid brukt: " + (endTime - startTime));

                assertIsString(CAMPUS_BO_LAT);
                assertIsString(CAMPUS_BO_LONG);

                // Regner ut avstand fra campus bø
                const distance: number = calculateDistance(
                    location.coords.latitude,
                    location.coords.longitude,
                    parseFloat(CAMPUS_BO_LAT),
                    parseFloat(CAMPUS_BO_LONG)
                );
                const withinDistanceCheck: boolean = distance <= MAX_DISTANCE_KM;
                setIsWithinCampus(withinDistanceCheck);

                if (!isWithinCampus) {
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
                setIsLoading(false);
            }
        }

        getCurrentLocation();

    }, []);

    console.log(`location status: ${locationStatus}`);
    return [isWithinCampus, isLoading];
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

export function assertIsString(value: unknown): asserts value is string {
    if (typeof value !== "string") throw new Error('value is not a string');
}