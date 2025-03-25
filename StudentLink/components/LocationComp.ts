import {useEffect, useState} from "react";
import * as Location from "expo-location";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import {JsonObject} from "type-fest";
import {LocationObject} from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function LocationComp() {
    // const [location, setLocation] = useState<Location.LocationObject | null>(null);
    // location er en array med longditude+latidude
    const [location, setLocation] = useState<LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function getCurrentLocation(): Promise<void> {

            // @ts-ignore
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                // burde redirectes til en "du må gi location access" side
                return;
            }

            console.warn(status.toString());

            let getLocation = await Location.getCurrentPositionAsync({});
            setLocation(getLocation);

        }

        getCurrentLocation();
        storeLocationData(location);
    }, []);

    return {location, errorMsg}
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
