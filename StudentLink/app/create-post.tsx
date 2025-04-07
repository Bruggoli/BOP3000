// create-post.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from '@/components/Navigation/BottomMenu';
import Navbar from '@/components/Navigation/Navbar';
import {router} from "expo-router";

export default function CreatePostScreen() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedClub, setSelectedClub] = useState('');
    const [userId, setUserId] = useState('');
    const [clubs, setClubs] = useState<any[]>([]);

    useEffect(() => {
        const loadUserId = async () => {
            const id = await AsyncStorage.getItem('userId');
            if (id) setUserId(id);
        };
        loadUserId();

        const fetchClubs = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_LOCALHOST}/klubb`);
                const data = await response.json();
                setClubs(data);
            } catch (error) {
                console.error('Feil ved henting av klubber:', error);
            }
        };
        fetchClubs();
    }, []);

    const handleCreatePost = async () => {
        if (!title || !content) {
            Alert.alert('Feil', 'Tittel og innhold kan ikke være tomme');
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
            const response = await fetch(`${process.env.EXPO_PUBLIC_LOCALHOST}/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(post),
            });

            if (response.ok) {
                Alert.alert('Suksess', 'Innlegget ble opprettet!');
                setTitle('');
                setContent('');
                setSelectedClub('');
                router.replace('/'); // 🚀 Naviger til index
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
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedClub}
                    onValueChange={(itemValue) => setSelectedClub(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Ingen klubb" value="" />
                    {clubs.map((club) => (
                        <Picker.Item key={club._id} label={club.navn} value={club._id} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleCreatePost}>
                <Text style={styles.buttonText}>Publiser</Text>
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
    pickerContainer: {
        backgroundColor: '#222',
        borderRadius: 8,
        marginBottom: 16,
    },
    picker: {
        color: 'white',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
