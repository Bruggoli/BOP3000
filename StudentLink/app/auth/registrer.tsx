import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Feil', 'Alle felt må fylles ut');
            return;
        }

        if (!email.endsWith('@usn.no')) {
            Alert.alert('Feil', 'Du må bruke en @usn.no e-postadresse');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Feil', 'Passordene matcher ikke');
            return;
        }

        const profil = {
            username,
            email: email.trim().toLowerCase(), // 👈 legg til denne
            password,
            icon: 'https://your-api.com/avatars/avatar1.png',
            medlemskap: [],
        };

        try {
            const response = await fetch('http://10.0.2.2:3000/profil', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profil),
            });

            const result = await response.json();
            const userId = result.id;

            if (!userId) {
                Alert.alert("Feil", "Bruker-ID mangler i respons");
                return;
            }


            await AsyncStorage.setItem('userId', userId);
            await AsyncStorage.setItem('userToken', 'loggedIn');
            Alert.alert("Suksess", "Bruker registrert! Bekreft e-posten din for å logge inn.");
            router.replace('/auth/login');
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
                placeholder="E-postadresse (@usn.no)"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                onChangeText={setEmail}
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