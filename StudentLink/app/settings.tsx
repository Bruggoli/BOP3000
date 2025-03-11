import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import BottomMenu from "@/components/Navigation/BottomMenu";
import Navbar from "@/components/Navigation/Navbar";

export default function SettingsScreen() {
    const [username, setUsername] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadSettings = async () => {
            const storedUsername = await AsyncStorage.getItem('username');
            const storedTheme = await AsyncStorage.getItem('theme');

            if (storedUsername) setUsername(storedUsername);
            if (storedTheme) setIsDarkMode(storedTheme === 'dark');
        };

        loadSettings();
    }, []);

    const handleSaveUsername = async () => {
        if (!username.trim()) {
            Alert.alert('Feil', 'Brukernavn kan ikke være tomt.');
            return;
        }

        await AsyncStorage.setItem('username', username);
        Alert.alert('Suksess', 'Brukernavn oppdatert!');
    };

    const toggleTheme = async () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        await AsyncStorage.setItem('theme', newTheme);
        setIsDarkMode(!isDarkMode);
        Alert.alert('Suksess', `Tema endret til ${newTheme === 'dark' ? 'Mørkt' : 'Lyst'}.`);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        router.replace('/login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Settings" toggleTheme={() => {}} />

            {/* 🚀 Boks rundt innstillingene */}
            <View style={styles.settingsBox}>

                {/* Endre brukernavn */}
                <Text style={styles.label}>Endre brukernavn:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Skriv nytt brukernavn"
                    placeholderTextColor="#aaa"
                    value={username}
                    onChangeText={setUsername}
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveUsername}>
                    <Text style={styles.buttonText}>Lagre</Text>
                </TouchableOpacity>

                {/* Bytt mellom mørkt/lyst tema */}
                <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
                    <Text style={styles.buttonText}>Bytt til {isDarkMode ? 'Lyst' : 'Mørkt'} tema</Text>
                </TouchableOpacity>

                {/* Logg ut */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logg ut</Text>
                </TouchableOpacity>
            </View>

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
    settingsBox: {
        backgroundColor: '#222', // Mørk bakgrunn for boksen
        borderRadius: 12, // Runde hjørner
        padding: 20,
        marginTop: 20, // 🚀 Senker boksene litt ned fra Navbar
        shadowColor: '#000', // Skygge for effekt
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Skygge på Android
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        color: 'white',
        marginBottom: 5,
    },
    input: {
        width: '100%',
        padding: 12,
        backgroundColor: '#333',
        color: 'white',
        borderRadius: 8,
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    themeButton: {
        backgroundColor: '#FF9800',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    logoutButton: {
        backgroundColor: '#D32F2F',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
