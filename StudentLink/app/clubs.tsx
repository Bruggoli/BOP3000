import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import axios from 'axios'; // Kommentar ut til senere
import ClubItem from '@/components/ClubItem';
import BottomMenu from "@/components/Navigation/BottomMenu";
import Navbar from "@/components/Navigation/Navbar";

export default function ClubsScreen() {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 🚀 Bruker testdata inntil databasen er koblet til
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

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Klubber" toggleTheme={() => {}} />

            <View style={styles.clubBox}>
                {loading ? (
                    <ActivityIndicator size="large" color="white" />
                ) : (
                    <FlatList
                        data={clubs}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => <ClubItem club={item} />}
                    />
                )}
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
    clubBox: {
        backgroundColor: '#222', // Bakgrunnsfarge for boksen
        borderRadius: 12, // Runde hjørner
        padding: 15,
        marginTop: 20, // 🚀 Senker boksene litt ned fra Navbar
        shadowColor: '#000', // Skygge for effekt
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Skygge på Android
    },
});
