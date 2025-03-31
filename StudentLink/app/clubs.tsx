import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ClubItem from '@/components/ClubItem';
import BottomMenu from "@/components/Navigation/BottomMenu";
import Navbar from "@/components/Navigation/Navbar";

export default function ClubsScreen() {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async (query = "") => {
        try {
            setLoading(true);
            const response    = await fetch(`http://10.0.2.2:3000/klubb?q=${query}`);
            const data = await response.json();
            setClubs(data);
        } catch (error) {
            console.error('Feil ved henting av klubber:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        fetchClubs(query);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Klubber" toggleTheme={() => {}} />

            {/* 🔹 Søkeboks */}
            <TextInput
                style={styles.searchInput}
                placeholder="Søk etter klubber..."
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={handleSearch}
            />

            {/* 🔹 Knapp for å lage ny klubb */}
            <TouchableOpacity style={styles.createButton} onPress={() => router.push('/create-klubb')}>
                <Text style={styles.buttonText}>Lag ny Klubb</Text>
            </TouchableOpacity>


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
    searchInput: {
        backgroundColor: '#222',
        color: 'white',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    createButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    clubBox: {
        backgroundColor: '#222',
        borderRadius: 12,
        padding: 15,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
