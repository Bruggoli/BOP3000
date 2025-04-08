import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from '@/components/Navigation/BottomMenu';
import Navbar from '@/components/Navigation/Navbar';
import { router } from 'expo-router';

export default function CreatePostScreen() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedClub, setSelectedClub] = useState('');
    const [userId, setUserId] = useState('');
    const [clubs, setClubs] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const id = await AsyncStorage.getItem('userId');
            if (!id) return;
            setUserId(id);

            const [clubRes, profileRes] = await Promise.all([
                fetch('http://10.0.2.2:3000/klubb'),
                fetch(`http://10.0.2.2:3000/profil/${id}`),
            ]);

            const allClubs = await clubRes.json();
            const profile = await profileRes.json();
            const followed = profile.følgerKlubber.map((c: any) => c.toString());

            const filtered = allClubs.filter((club: any) =>
                followed.includes(club._id.toString())
            );
            setClubs(filtered);
        };

        loadData();
    }, []);

    const handleCreatePost = async () => {
        if (!title || !content) {
            Alert.alert('Feil', 'Tittel og innhold kan ikke være tomme');
            return;
        }

        if (selectedClub && !clubs.find((c) => c._id === selectedClub)) {
            Alert.alert('Feil', 'Du kan ikke poste i en klubb du ikke følger.');
            return;
        }

        const post = {
            brukerId: userId,
            tittel: title,
            innhold: content,
            klubbId: selectedClub || null,
            likes: [],
            kommentarer: [],
            opprettet: new Date().toISOString(),
        };

        try {
            const response = await fetch('http://10.0.2.2:3000/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(post),
            });

            if (response.ok) {
                Alert.alert('Suksess', 'Innlegget ble opprettet!');
                setTitle('');
                setContent('');
                setSelectedClub('');
                router.replace('/');
            } else {
                Alert.alert('Feil', 'Kunne ikke opprette innlegget.');
            }
        } catch (error) {
            console.error('Feil ved oppretting av innlegg:', error);
            Alert.alert('Feil', 'Noe gikk galt ved oppretting.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Nytt innlegg" toggleTheme={() => {}} />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <Text style={styles.label}>Tittel</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Skriv en tittel..."
                    placeholderTextColor="#aaa"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Innhold</Text>
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    placeholder="Skriv innholdet her..."
                    placeholderTextColor="#aaa"
                    multiline
                    value={content}
                    onChangeText={setContent}
                />

                <Text style={styles.label}>Velg klubb (valgfritt)</Text>
                <View style={styles.clubPickerRow}>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedClub}
                            onValueChange={(itemValue) => setSelectedClub(itemValue)}
                            style={styles.picker}
                            dropdownIconColor="white"
                        >
                            <Picker.Item label="New Feed (Ingen klubb)" value="" />
                            {clubs.map((club) => (
                                <Picker.Item key={club._id} label={club.navn} value={club._id} />
                            ))}
                        </Picker>
                    </View>
                    {selectedClub !== '' && (
                        <TouchableOpacity style={styles.clearButton} onPress={() => setSelectedClub('')}>
                            <Text style={styles.clearButtonText}>X</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleCreatePost}>
                    <Text style={styles.buttonText}>Publiser</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>

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
    label: {
        color: 'white',
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#222',
        color: 'white',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    clubPickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    pickerContainer: {
        backgroundColor: '#222',
        borderRadius: 8,
        flex: 1,
    },
    picker: {
        color: 'white',
    },
    clearButton: {
        marginLeft: 10,
        backgroundColor: '#333',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
