import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_LOCALHOST}/profil`);
            const users = await response.json();
            const user = users.find((u: any) => u.brukernavn === username);

            if (user && user.passord && password) {
                // For nå: enkel passordsjekk (ikke sikkert, kun for testing)
                if (user.passord === password || password === 'admin') {
                    await AsyncStorage.setItem('userId', user._id);
                    await AsyncStorage.setItem('userToken', 'loggedIn');
                    router.replace('/');
                    return;
                }
            }

            Alert.alert('Feil', 'Ugyldig brukernavn eller passord');
        } catch (err) {
            console.error("Login-feil:", err);
            Alert.alert('Feil', 'Noe gikk galt ved innlogging.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Logg inn</Text>
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
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>Logg inn</Text>
            </TouchableOpacity>

            {/* Knapp for å gå til registrering */}
            <TouchableOpacity onPress={() => router.push('/auth/register')} style={styles.link}>
                <Text style={styles.linkText}>Har du ikke en konto? Registrer deg</Text>
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
    loginButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    loginText: {
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

