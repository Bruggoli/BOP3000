import {useEffect, useState} from "react";
import * as Location from "expo-location"

const campusLatitude: number = 37.4220936;
const campusLongdidtude: number = -122.083922;

const [location, setLocation] = useState<Location.LocationObject | null>(null);
const [errorMsg, setErrorMsg] = useState<string | null>(null);


export function LocationPermission() {
    useEffect(() => {
        async function getCurrentLocation() {

            // @ts-ignore
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            console.warn(status.toString())

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

        }

        getCurrentLocation();
    }, []);

    return {location, errorMsg}
}

//export function isInsideArea() {
//    return location.latitude
//}
