import {useEffect, useState} from "react";
import * as Location from "expo-location";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import {JsonObject} from "type-fest";
import {LocationObject, LocationPermissionResponse} from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export function LocationComp() {
    // const [location, setLocation] = useState<Location.LocationObject | null>(null);
    // location er en array med longditude+latidude
    const [locationStatus, setLocationStatus] = useState<string | null>(null);

    useEffect(() => {
        async function getCurrentLocation(): Promise<void> {

            // @ts-ignore
            let  status: LocationPermissionStatus  = await Location.requestForegroundPermissionsAsync();
            console.log(status.status);
            if (status.status != 'granted') {
                setLocationStatus('Permission to access location was denied');
                // burde redirectes til en "du må gi location access" side
                //
                router.replace("/terms-of-service");
                return;
            }
        }
        getCurrentLocation();

    }, []);

    return locationStatus;
}

export function getLocationData (): boolean {

    return false;
}

const storeLocationData = async (locationData: LocationObject | null): Promise<void> => {
    if (locationData === null) {
        throw Error("location not found location is null");
    }
    try {
        await AsyncStorage.setItem("location", JSON.stringify(locationData));
    } catch (e) {
        console.error("Error storing data; " + e)
    }
}
