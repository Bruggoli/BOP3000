import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Navbar from '@/components/Navigation/Navbar';
import BottomMenu from '@/components/Navigation/BottomMenu';

export default function SettingsScreen() {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const server = process.env.EXPO_PUBLIC_LOCALHOST;

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
            if (res.ok) Alert.alert('✅ Oppdatert', 'Brukernavn endret');
            else Alert.alert('❌ Feil', 'Kunne ikke oppdatere brukernavn');
        } catch (err) {
            console.error('Feil ved endring av brukernavn:', err);
        }
    };

    const handlePasswordChange = async () => {
        if (!password || password !== confirmPassword) {
            Alert.alert('❌ Feil', 'Passordene matcher ikke eller er tomme');
            return;
        }
        try {
            const res = await fetch(`${server}/profil/${userId}/password`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword: password }),
            });
            if (res.ok) Alert.alert('✅ Oppdatert', 'Passord endret');
            else Alert.alert('❌ Feil', 'Kunne ikke endre passord');
        } catch (err) {
            console.error('Feil ved endring av passord:', err);
        }
    };

    const handleDelete = async () => {
        Alert.alert('Slett konto', 'Er du sikker på at du vil slette kontoen?', [
            { text: 'Avbryt', style: 'cancel' },
            {
                text: 'Ja, slett',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await fetch(`${server}/profil/${userId}`, { method: 'DELETE' });
                        await AsyncStorage.clear();
                        router.replace('/auth/login');
                    } catch (err) {
                        Alert.alert('❌ Feil', 'Kunne ikke slette bruker');
                    }
                },
            },
        ]);
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
            <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleDelete}>
                <Text style={styles.buttonText}>Slett bruker</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logg ut</Text>
            </TouchableOpacity>

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
