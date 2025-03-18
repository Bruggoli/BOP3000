import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ClubItem from '@/components/ClubItem';
import BottomMenu from "@/components/Navigation/BottomMenu";
import Navbar from "@/components/Navigation/Navbar";

// type for klubbene
interface Klubb {
    _id: string;
    navn: string;
    beskrivelse: string;
    admin: string;
    medlemmer: string[];
    createdAt: string;
}

export default function ClubsScreen() {
    const [clubs, setClubs] = useState<Klubb[]>([]); // 🔹 Bruker typen Klubb[]
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await fetch('http://localhost:3000/klubb'); // Henter fra backend
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data: Klubb[] = await response.json();
                setClubs(data);
            } catch (error) {
                console.error('Feil ved henting av klubber:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
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
                        keyExtractor={(item) => item._id} // 🎯 Nå vet TypeScript at _id eksisterer
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


