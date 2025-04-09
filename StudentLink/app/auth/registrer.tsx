import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const router = useRouter();

    const showAlert = (message: string) => {
        setModalMessage(message);
        setModalVisible(true);
    };

    const handleRegister = async () => {
        if (!username || !email || !password || !confirmPassword) {
            showAlert('Alle felt må fylles ut');
            return;
        }

        if (!email.endsWith('@usn.no')) {
            showAlert('Du må bruke en @usn.no e-postadresse');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Passordene matcher ikke');
            return;
        }

        const profil = {
            username,
            email,
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
                showAlert("Bruker-ID mangler i respons");
                return;
            }

            await AsyncStorage.setItem('userId', userId);
            await AsyncStorage.setItem('userToken', 'loggedIn');
            showAlert("Bruker registrert! Bekreft e-posten din for å logge inn.");
            setTimeout(() => {
                setModalVisible(false);
                router.replace('/auth/login');
            }, 2000);
        } catch (err) {
            console.error("Registreringsfeil:", err);
            showAlert('Kunne ikke registrere bruker.');
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

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.alertBox}>
                        <Text style={styles.alertText}>{modalMessage}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.alertButton}>
                            <Text style={styles.alertButtonText}>OK</Text>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        backgroundColor: '#222',
        padding: 25,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    alertText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    alertButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    alertButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
