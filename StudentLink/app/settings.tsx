import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Navbar from '@/components/Navigation/Navbar';
import BottomMenu from '@/components/Navigation/BottomMenu';
import CustomAlert from '@/components/CustomAlert';

export default function SettingsScreen() {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const router = useRouter();
    const server = process.env.EXPO_PUBLIC_LOCALHOST;

    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const id = await AsyncStorage.getItem('userId');
            if (!id) return;
            setUserId(id);
            const res = await fetch(`${server}/profil/${id}`);
            const data = await res.json();
            setUsername(data.brukernavn || '');
        };
        fetchProfile();
    }, []);

    const handleUsernameChange = async () => {
        try {
            const res = await fetch(`${server}/profil/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brukernavn: username }),
            });
            if (res.ok) showAlert('✅ Oppdatert', 'Brukernavn endret');
            else showAlert('❌ Feil', 'Kunne ikke oppdatere brukernavn');
        } catch (err) {
            console.error('Feil ved endring av brukernavn:', err);
        }
    };

    const handlePasswordChange = async () => {
        if (!password || password !== confirmPassword) {
            showAlert('❌ Feil', 'Passordene matcher ikke eller er tomme');
            return;
        }
        try {
            const res = await fetch(`${server}/profil/${userId}/password`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword: password }),
            });
            if (res.ok) {
                showAlert('✅ Oppdatert', 'Passord endret');
                setPassword('');
                setConfirmPassword('');
            }
            else showAlert('❌ Feil', 'Kunne ikke endre passord');
        } catch (err) {
            console.error('Feil ved endring av passord:', err);
        }
    };

    const handleDelete = async () => {
        showAlert('Slett konto', 'Gå til profilen for å slette brukeren.');
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('userToken');
        router.replace('/auth/login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Innstillinger" toggleTheme={() => {}} />

            <Text style={styles.sectionTitle}>Endre brukernavn</Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Nytt brukernavn"
                placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.button} onPress={handleUsernameChange}>
                <Text style={styles.buttonText}>Lagre brukernavn</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Endre passord</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholder="Nytt passord"
                placeholderTextColor="#999"
            />
            <TextInput
                style={styles.input}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Bekreft passord"
                placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
                <Text style={styles.buttonText}>Lagre passord</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Konto</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logg ut</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleDelete}>
            <Text style={styles.buttonText}>Slett bruker</Text>
        </TouchableOpacity>

            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />

            <BottomMenu />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    sectionTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 20,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#222',
        color: 'white',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    dangerButton: {
        backgroundColor: '#e53935',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
