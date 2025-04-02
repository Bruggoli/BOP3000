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
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');
    const [deleteOptions, setDeleteOptions] = useState({ kommentarer: false, poster: false });


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
        router.replace('/auth/login');
    };

    const handleDeleteUser = () => {
        Alert.alert(
            "Slett bruker",
            "Vil du også slette alt innhold du har laget?",
            [
                {
                    text: "Bare slett bruker",
                    onPress: () => {
                        setDeleteOptions({ kommentarer: false, poster: false });
                        setDeleteModalVisible(true);
                    },
                    style: "destructive",
                },
                {
                    text: "Slett bruker + kommentarer",
                    onPress: () => {
                        setDeleteOptions({ kommentarer: true, poster: false });
                        setDeleteModalVisible(true);
                    },
                    style: "destructive",
                },
                {
                    text: "Slett ALT (bruker, kommentarer og poster)",
                    onPress: () => {
                        setDeleteOptions({ kommentarer: true, poster: true });
                        setDeleteModalVisible(true);
                    },
                    style: "destructive",
                },
                {
                    text: "Bare slett kommentarer",
                    onPress: () => {
                        setDeleteOptions({ kommentarer: true, poster: false });
                        setDeleteModalVisible(true);
                    },
                    style: "destructive",
                },
                {
                    text: "Bare slett poster",
                    onPress: () => {
                        setDeleteOptions({ kommentarer: false, poster: true });
                        setDeleteModalVisible(true);
                    },
                    style: "destructive",
                },
                {
                    text: "Avbryt",
                    onPress: () => setDeleteModalVisible(false),
                    style: "cancel",
                },
                { text: "Avbryt", style: "cancel" },
            ]
        );
    };


    const confirmDelete = async (valg: { kommentarer: boolean; poster: boolean }) => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) return;

            const query = new URLSearchParams();
            if (valg.kommentarer) query.append('slettKommentarer', 'true');
            if (valg.poster) query.append('slettPoster', 'true');

            const res = await fetch(`http://10.0.2.2:3000/profil/${userId}?${query.toString()}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await AsyncStorage.clear();
                Alert.alert("Bruker slettet", "Alt valgt innhold er slettet.");
                router.replace('/auth/login');
            } else {
                const msg = await res.text();
                Alert.alert("Feil", msg);
            }
        } catch (err) {
            Alert.alert("Feil", "Klarte ikke å slette bruker.");
            console.error("Slette bruker error:", err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Settings" toggleTheme={() => {}} />

            <View style={styles.settingsBox}>
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

                <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
                    <Text style={styles.buttonText}>Bytt til {isDarkMode ? 'Lyst' : 'Mørkt'} tema</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logg ut</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteUser}>
                    <Text style={styles.buttonText}>🗑️ Slett bruker</Text>
                </TouchableOpacity>
            </View>

            <BottomMenu />
            {deleteModalVisible && (
                <View style={styles.overlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Bekreft sletting</Text>
                        <Text style={styles.modalText}>Skriv inn <Text style={{ fontWeight: 'bold' }}>"slett bruker"</Text> for å bekrefte.</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="skriv her..."
                            placeholderTextColor="#aaa"
                            value={deleteInput}
                            onChangeText={setDeleteInput}
                        />
                        <TouchableOpacity
                            style={[styles.deleteButton, { marginTop: 10 }]}
                            onPress={() => {
                                if (deleteInput.toLowerCase().trim() === 'slett bruker') {
                                    confirmDelete(deleteOptions);
                                    setDeleteModalVisible(false);
                                    setDeleteInput('');
                                } else {
                                    Alert.alert('Feil', 'Du må skrive "slett bruker" nøyaktig.');
                                }
                            }}
                        >
                            <Text style={styles.buttonText}>Bekreft sletting</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.logoutButton, { marginTop: 10 }]}
                            onPress={() => {
                                setDeleteModalVisible(false);
                                setDeleteInput('');
                            }}
                        >
                            <Text style={styles.buttonText}>Avbryt</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

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
        backgroundColor: '#222',
        borderRadius: 12,
        padding: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
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
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: '#9C27B0',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    overlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#222',
        padding: 20,
        borderRadius: 12,
        width: '85%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 14,
        color: '#ccc',
        marginBottom: 10,
        textAlign: 'center',
    },

});
