import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CustomAlert from '@/components/CustomAlert';

export default function LogoutScreen() {
    const router = useRouter();
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        const logout = async () => {
            try {
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('userId');
                router.replace('/auth/login');
            } catch (err) {
                console.error("❌ Feil ved utlogging:", err);
                setAlertTitle('Feil');
                setAlertMessage('Klarte ikke å logge ut. Prøv igjen.');
                setAlertVisible(true);
            }
        };

        logout();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="white" />

            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
