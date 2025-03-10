import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import axios from 'axios'; // Kommentar ut til senere
import ClubItem from '@/components/ClubItem';
import BottomMenu from "@/components/Navigation/BottomMenu";

export default function ClubsScreen() {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 🚀 Bruk testdata inntil databasen er koblet til
        const mockClubs = [
            {
                _id: '67b32fb08403dc0a510e500d',
                navn: 'Bokklubben',
                beskrivelse: 'En klubb for bokelskere',
                admin: 'studentnummer*',
                medlemmer: ['user1'],
                createdAt: '2024-03-05T12:00:00.000Z',
            },
            {
                _id: '67b32fb08403dc0a510e501e',
                navn: 'Fotballklubben',
                beskrivelse: 'For fotballinteresserte',
                admin: 'studentnummer2',
                medlemmer: [],
                createdAt: '2024-03-06T14:30:00.000Z',
            },
        ];
        setClubs(mockClubs);
        setLoading(false);

        /* 🚀 Avkommenter dette når databasen er klar
        const fetchClubs = async () => {
            try {
                const response = await axios.get('https://your-api-url.com/clubs');
                setClubs(response.data);
            } catch (error) {
                console.error('Feil ved henting av klubber:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClubs();
        */
    }, []);

    // @ts-ignore
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Klubber</Text>

            {loading ? (
                <ActivityIndicator size="large" color="white" />
            ) : (
                <FlatList
                    data={clubs}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <ClubItem club={item} />}
                />
            )}
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
});
