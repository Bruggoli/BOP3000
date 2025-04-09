import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from "@/components/Navigation/BottomMenu";
import Navbar from "@/components/Navigation/Navbar";
import CustomAlert from "@/components/CustomAlert";

const availableColors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E', '#6B7280', '#94A3B8', '#64748B',
];

export default function CreateKlubb() {
    const [clubName, setClubName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState(availableColors[0]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const router = useRouter();

    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const handleCreateClub = async () => {
        if (!clubName.trim() || !description.trim()) {
            showAlert('Feil', 'Klubbnavn og beskrivelse kan ikke være tomme.');
            return;
        }

        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                showAlert('Feil', 'Bruker ikke logget inn. Kan ikke opprette klubb.');
                return;
            }

            const clubData = {
                navn: clubName,
                beskrivelse: description,
                brukerId: userId,
                følgere: [],
                farge: selectedColor,
            };

            const response = await fetch('http://10.0.2.2:3000/klubb', {
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
            showAlert('Suksess', 'Klubben ble opprettet!');

            setTimeout(() => {
                setAlertVisible(false);
                router.replace('/clubs');
            }, 1500);
        } catch (error: any) {
            console.error('Feil ved oppretting av klubb:', error.message);
            showAlert('Feil', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Lag ny Klubb" toggleTheme={() => {}} />

            <Text style={styles.title}>Opprett en ny Klubb</Text>

            <TextInput
                style={styles.input}
                placeholder="Skriv inn klubbnavn."
                placeholderTextColor="#aaa"
                value={clubName}
                onChangeText={setClubName}
            />

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Skriv inn en beskrivelse."
                placeholderTextColor="#aaa"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <Text style={styles.label}>Velg klubbfarge:</Text>
            <View style={styles.colorGrid}>
                {availableColors.map((color) => (
                    <TouchableOpacity
                        key={color}
                        style={[
                            styles.colorButton,
                            { backgroundColor: color },
                            selectedColor === color && styles.selectedColor,
                        ]}
                        onPress={() => setSelectedColor(color)}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleCreateClub}>
                <Text style={styles.buttonText}>Opprett Klubb</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={styles.buttonText}>Avbryt</Text>
            </TouchableOpacity>

            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />

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
    label: {
        color: 'white',
        marginBottom: 8,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: 'white',
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
