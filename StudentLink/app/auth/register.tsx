import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        if (!username || !password || !confirmPassword) {
            Alert.alert('Feil', 'Alle felt må fylles ut');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Feil', 'Passordene matcher ikke');
            return;
        }

        const profil = {
            brukernavn: username,
            passord: password,
            icon: 'https://your-api.com/avatars/avatar1.png',
            medlemskap: [],
        };

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_LOCALHOST}/profil`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profil),
            });

            const result = await response.json();
            const userId = result.id;

            await AsyncStorage.setItem('userId', userId);
            await AsyncStorage.setItem('userToken', 'loggedIn');
            router.replace('/');
        } catch (err) {
            console.error("Registreringsfeil:", err);
            Alert.alert('Feil', 'Kunne ikke registrere bruker.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Registrer ny bruker</Text>
            <TextInput
                style={styles.input}
                placeholder="Brukernavn"
                placeholderTextColor="#aaa"
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Passord"
                placeholderTextColor="#aaa"
                secureTextEntry
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Bekreft passord"
                placeholderTextColor="#aaa"
                secureTextEntry
                onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerText}>Registrer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.link}>
                <Text style={styles.linkText}>Har du allerede en konto? Logg inn</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#222',
        color: 'white',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    registerButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    registerText: {
        color: 'white',
        fontWeight: 'bold',
    },
    link: {
        marginTop: 16,
        alignItems: 'center',
    },
    linkText: {
        color: '#29B6F6',
    },
});
