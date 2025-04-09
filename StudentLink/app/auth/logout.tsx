import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LogoutScreen() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            // Fjern alle relevante lagrede data
            await AsyncStorage.multiRemove(['userId', 'userToken', 'userEmail']);

            // Naviger til login
            router.replace('/auth/login');
        };

        logout();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
            <ActivityIndicator size="large" color="white" />
        </View>
    );
}
