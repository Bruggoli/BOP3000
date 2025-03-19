import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ClubItem from '@/components/ClubItem';
import BottomMenu from "@/components/Navigation/BottomMenu";
import Navbar from "@/components/Navigation/Navbar";

export default function ClubsScreen() {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await fetch('http://10.0.2.2:3000/klubb');
                const data = await response.json();
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
        backgroundColor: '#222',
        borderRadius: 12,
        padding: 15,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
