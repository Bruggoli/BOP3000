import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from "@/components/Navigation/BottomMenu";
import Navbar from "@/components/Navigation/Navbar";

export default function CreateKlubb() {
    const [clubName, setClubName] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();

    const handleCreateClub = async () => {
        if (!clubName.trim() || !description.trim()) {
            Alert.alert('Feil', 'Klubbnavn og beskrivelse kan ikke være tomme.');
            return;
        }

        // Hent brukerId fra AsyncStorage (midlertidig hardkodet hvis ikke implementert)
        let userId = await AsyncStorage.getItem('userId');
        if (!userId) userId = "testUser"; // Midlertidig løsning til innlogging er på plass

        const clubData = {
            brukerId: userId,
            navn: clubName,
            beskrivelse: description,
        };

        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_LOCALHOST}/klubb`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clubData),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Feil ved oppretting av klubb: ${errorMessage}`);
            }

            setClubName('');
            setDescription('');
            router.replace('/clubs'); // Naviger tilbake til klubboversikten
        } catch (error) {

            console.error('Feil ved oppretting av klubb:', (error as Error).message);
            Alert.alert('Feil', (error as Error).message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Lag ny Klubb" toggleTheme={() => {}} />

            <Text style={styles.title}>Opprett en ny Klubb</Text>

            <TextInput
                style={styles.input}
                placeholder="Skriv inn klubbnavn..."
                placeholderTextColor="#aaa"
                value={clubName}
                onChangeText={setClubName}
            />

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Skriv inn en beskrivelse..."
                placeholderTextColor="#aaa"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <TouchableOpacity style={styles.createButton} onPress={handleCreateClub}>
                <Text style={styles.buttonText}>Opprett Klubb</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={styles.buttonText}>Avbryt</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        padding: 12,
        backgroundColor: '#222',
        color: 'white',
        borderRadius: 8,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    createButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    cancelButton: {
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

