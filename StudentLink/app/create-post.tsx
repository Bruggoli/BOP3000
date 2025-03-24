import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BottomMenu from "@/components/Navigation/BottomMenu";

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();

    const handlePost = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('Feil', 'Tittel og innhold kan ikke være tomme.');
            return;
        }
// test user må bli fjernet når profiler er i orden
        const postData = {
            brukerId: "testUser", // Midlertidig ID
            tittel: title,
            innhold: content,
            opprettet: new Date().toISOString(),
        };

        try {
            const response = await fetch('http://10.0.2.2:3000/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Feil ved oppretting av post: ${errorMessage}`);
            }

            const updatedPosts = await response.json();
            console.log("✅ Oppdatert liste med poster:", updatedPosts);

            router.replace('/');
        } catch (error) {
            // @ts-ignore
            console.error('❌ Feil ved publisering:', error.message);
            // @ts-ignore
            Alert.alert('Feil', error.message);
        }
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
