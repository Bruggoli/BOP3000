import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const router = useRouter();

    const showAlert = (message: string) => {
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('http://10.0.2.2:3000/profil/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            console.log("🔁 Status:", response.status);
            const result = await response.json();
            console.log("📨 Backend-respons:", result);

            if (response.ok && result.userId) {
                await AsyncStorage.setItem('userId', result.userId);
                await AsyncStorage.setItem('userToken', 'loggedIn');
                router.replace('/');
            } else {
                showAlert(result.error || 'Ugyldig e-post eller passord');
            }
        } catch (err) {
            console.error("Login-feil:", JSON.stringify(err, null, 2));
            showAlert('Noe gikk galt ved innlogging.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Logg inn</Text>
            <TextInput
                style={styles.input}
                placeholder="E-postadresse"
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
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>Logg inn</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/auth/registrer')} style={styles.link}>
                <Text style={styles.linkText}>Har du ikke en konto? Registrer deg</Text>
            </TouchableOpacity>

            {/* 🔔 Custom svart alert */}
            <Modal
                visible={alertVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setAlertVisible(false)}
            >
                <View style={styles.alertOverlay}>
                    <View style={styles.alertBox}>
                        <Text style={styles.alertText}>{alertMessage}</Text>
                        <TouchableOpacity
                            style={styles.alertButton}
                            onPress={() => setAlertVisible(false)}
                        >
                            <Text style={styles.alertButtonText}>Lukk</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    alertOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        backgroundColor: '#222',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    alertText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 12,
        textAlign: 'center',
    },
    alertButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    alertButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
