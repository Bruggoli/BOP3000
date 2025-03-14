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
        // 🔑 Hardkodet bakdør for testing
        if (username === 'brukernavn' && password === 'admin') {
            await AsyncStorage.setItem('userToken', 'loggedIn');
            router.replace('/');
            return;
        }

        // Hent lagrede brukere fra AsyncStorage
        const storedUsers = await AsyncStorage.getItem('users');
        const users = storedUsers ? JSON.parse(storedUsers) : {};

        if (users[username] && users[username].password === password) {
            await AsyncStorage.setItem('userToken', 'loggedIn');
            router.replace('/');
        } else {
            Alert.alert('Feil', 'Ugyldig brukernavn eller passord');
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
            <TouchableOpacity onPress={() => router.push('/register')} style={styles.link}>
                <Text style={styles.linkText}>Har du ikke en konto? Registrer deg</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 12,
        backgroundColor: '#222',
        color: 'white',
        borderRadius: 8,
        marginBottom: 15,
    },
    loginButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    loginText: {
        color: 'white',
        fontWeight: 'bold',
    },
    link: {
        marginTop: 15,
    },
    linkText: {
        color: '#4CAF50',
    },
});
