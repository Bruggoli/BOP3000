import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from "@/components/Navigation/BottomMenu";
// import axios from 'axios'; // Kommentert ut til databasen er klar

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedClub, setSelectedClub] = useState('Populær Feed');
    const [clubs, setClubs] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // 🚀 Bruker testdata inntil databasen er koblet til
        const mockClubs = [
            { _id: '67b32fb08403dc0a510e500d', navn: 'Bokklubben' },
            { _id: '67b32fb08403dc0a510e501e', navn: 'Fotballklubben' },
        ];
        setClubs(mockClubs);

        /* 🚀 Avkommenter når databasen er klar
        const fetchClubs = async () => {
            try {
                const response = await axios.get('https://your-api-url.com/clubs');
                setClubs(response.data);
            } catch (error) {
                console.error('Feil ved henting av klubber:', error);
            }
        };
        fetchClubs();
        */
    }, []);

    const handlePost = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('Feil', 'Tittel og innhold kan ikke være tomme.');
            return;
        }

        const userId = await AsyncStorage.getItem('userId'); // Hent brukeren fra lokal lagring
        const postData = {
            brukerId: userId || 'testUser', // Midlertidig bruker-ID for testing
            tittel: title,
            innhold: content,
            klubb: selectedClub !== 'Populær Feed' ? selectedClub : null, // Null hvis populær feed
            likes: [],
            kommentarer: [],
            opprettet: new Date().toISOString(),
        };

        console.log('Post Data:', postData); // Test før API-kallet

        /* 🚀 Avkommenter når databasen er klar
        try {
            await axios.post('https://your-api-url.com/posts', postData);
            Alert.alert('Suksess', 'Innlegget ditt er publisert!');
            router.push('/'); // Gå tilbake til hovedsiden
        } catch (error) {
            console.error('Feil ved publisering:', error);
        }
        */

        // Simulerer suksess for nå
        Alert.alert('Test', 'Innlegget ditt er sendt! (Testmodus)');
        router.push('/');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Lag et nytt innlegg</Text>

            <TextInput
                style={styles.input}
                placeholder="Tittel"
                placeholderTextColor="#aaa"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Hva vil du dele?"
                placeholderTextColor="#aaa"
                multiline
                numberOfLines={5}
                value={content}
                onChangeText={setContent}
            />

            <Text style={styles.label}>Velg klubb (valgfritt):</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedClub}
                    onValueChange={(itemValue) => setSelectedClub(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Populær Feed (Ingen klubb valgt)" value="Populær Feed" />
                    {clubs.map((club) => (
                        <Picker.Item key={club._id} label={club.navn} value={club.navn} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
                <Text style={styles.buttonText}>Publiser</Text>
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
    label: {
        fontSize: 16,
        color: 'white',
        marginBottom: 5,
    },
    pickerContainer: {
        backgroundColor: '#222',
        borderRadius: 8,
        marginBottom: 15,
    },
    picker: {
        color: 'white',
    },
    postButton: {
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
