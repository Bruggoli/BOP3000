import { Slot, useRouter } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme, View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import BottomMenu from '@/components/Navigation/BottomMenu';

export default function TabsLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const userId = await AsyncStorage.getItem('userId');

            if (!userId) {
                router.replace('/auth/login');
            } else {
                setIsLoggedIn(true);
            }

            setIsLoading(false); // <- denne må alltid kjøre til slutt
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

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
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
});
