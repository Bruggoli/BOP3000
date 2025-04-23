import { Slot } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme, View, StyleSheet, Text } from 'react-native';
import BottomMenu from '@/components/Navigation/BottomMenu';
import locationCheck from '@/hooks/useLocationCheck';
import { useLocation } from '@/hooks/useLocation';
import {useState} from "react";

export default function RootLayout() {

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [ isLocationValid, isLoading ] = locationCheck();

    if (isLoading) {
        return (
            <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
                <View style={styles.container}>
                    <BottomMenu />
                </View>
            </ThemeProvider>
        )
    } else {
        if (isLocationValid) {
            return (
                <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
                    <View style={styles.container}>
                        <Slot />
                        <BottomMenu />
                    </View>
                </ThemeProvider>
            );
        } else {
            return (
                <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
                    <View style={styles.container}>
                        <Text style={styles.text}>Du er utenfor sonen</Text>
                        <BottomMenu />
                    </View>
                </ThemeProvider>
            )
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        textShadowColor: '#fff',
    }
});
