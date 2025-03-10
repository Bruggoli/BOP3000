import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LogoutScreen() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            await AsyncStorage.removeItem('userToken'); // Fjerner tokenet
            router.replace('/login'); // Sender brukeren til innloggingssiden
        };

        logout();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
            <ActivityIndicator size="large" color="white" />
        </View>
    );
}
