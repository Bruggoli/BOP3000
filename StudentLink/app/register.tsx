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

        try {
            alert("trying to connect to server\n" + username + "\n" + password)
            const response = await fetch("http://10.0.2.2:3000/profil", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                Alert.alert("Suksess", "Bruker registrert!");
                router.replace('/');
            } else {
                const errorData = await response.json();
                Alert.alert("Feil", errorData.error || "Noe gikk galt");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Feil", "Klarte ikke å koble til serveren");
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

            <TouchableOpacity onPress={() => router.push('/login')} style={styles.link}>
                <Text style={styles.linkText}>Har du allerede en konto? Logg inn</Text>
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
    registerButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    registerText: {
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
