import { useEffect, useState } from "react";
import { useLocation } from "@/hooks/useLocation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function isLocationValid(): [boolean, boolean] {

    const [isWithinCampus, isLocationLoading] = useLocation();
    const [currentLocation, setCurrentLocation] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLocation = async () => {
            try {
                console.log("location data: " + isWithinCampus);
                assertIsBool(isWithinCampus);
                setCurrentLocation(isWithinCampus);

            }catch (error: any) {
                console.warn("Error while checking if location is valid: " + error);
                setCurrentLocation(false);
            } finally {
                setLoading(false);
            }

        }
        setCurrentLocation(isWithinCampus);
        checkLocation();

    }, [isWithinCampus, isLocationLoading]);

    return [currentLocation, loading];
}

function assertIsBool(value: unknown): asserts value is boolean {
    if (typeof value !== "boolean") throw new Error('value is not a boolean: ' + typeof value);
}