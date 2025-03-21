import {useEffect, useState} from "react";
import * as Location from "expo-location";

export function LocationComp() {
    // const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function getCurrentLocation() {

            // @ts-ignore
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            console.warn(status.toString())

            //let location = await Location.getCurrentPositionAsync({});
            setLocation("her");
        }

        getCurrentLocation();
    }, []);

    return {location, errorMsg}
}
