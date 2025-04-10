import { useEffect, useState } from "react";
import { useLocation, assertIsString } from "@/hooks/useLocation";

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
            } finally {
                setLoading(false);
            }

        }
        checkLocation();
        setLoading(false);
    }, [isLocationLoading]);

    return [currentLocation, loading];
}

function assertIsBool(value: unknown): asserts value is boolean {
    if (typeof value !== "boolean") throw new Error('value is not a boolean: ' + typeof value);
}