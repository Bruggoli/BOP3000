import { Slot } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme, View, StyleSheet } from 'react-native';
import BottomMenu from '@/components/Navigation/BottomMenu';
import { LocationComp } from '@/components/LocationComp';
import {useState} from "react";

export default function RootLayout() {
    // kaller på location-comp for å sjekke om permission er gitt
    // LocationComp();

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';


    return (
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
            <View style={styles.container}>
                <Slot />
                <BottomMenu />
            </View>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
