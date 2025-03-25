import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { View, StyleSheet } from 'react-native';
import BottomMenu from '@/components/Navigation/BottomMenu';
import { LocationComp } from '@/components/LocationComp';
import {useState} from "react";

export default function RootLayout() {
    const systemColorScheme = useColorScheme();
    // kaller på location-comp for å sjekke om permission er gitt
    LocationComp();

    const isDark = systemColorScheme === 'dark';


    return (
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
            <View style={styles.container}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="profile" />
                    <Stack.Screen name="clubs" />
                    <Stack.Screen name="settings" />
                    <Stack.Screen name="terms-of-service" />
                    <Stack.Screen name="logout" />
                    <Stack.Screen name="login" />
                    <Stack.Screen name="register" />
                </Stack>
                {/* 🚀 Sørger for at BottomMenu alltid vises */}
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
