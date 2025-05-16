import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from "@/components/Navigation/BottomMenu";
import Navbar from "@/components/Navigation/Navbar";
import { FontAwesome } from '@expo/vector-icons';

export default function ClubsScreen() {
    const [clubs, setClubs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userId, setUserId] = useState('');
    const [followedClubs, setFollowedClubs] = useState<string[]>([]);
    const router = useRouter();
    const server = process.env.EXPO_PUBLIC_LOCALHOST;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const id = await AsyncStorage.getItem('userId');
                setUserId(id || '');

                const [clubRes, profileRes] = await Promise.all([
                    fetch(`${server}/klubb?q=${searchQuery}`),
                    fetch(`${server}/profil/${id}`)
                ]);

                const clubData = await clubRes.json();
                const profileData = await profileRes.json();
                setFollowedClubs(profileData?.følgerKlubber || []);
                setClubs(clubData);
            } catch (error) {
                console.error('Feil ved henting av klubber:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchQuery]);

    const toggleFollow = async (klubbId: string, isFollowing: boolean) => {
        try {
            const endpoint = isFollowing ? 'sluttfolg' : 'folg';
            const response = await fetch(`${server}/klubb/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brukerId: userId, klubbId }),
            });

            if (response.ok) {
                setFollowedClubs((prev) =>
                    isFollowing ? prev.filter((id) => id !== klubbId) : [...prev, klubbId]
                );
            }
        } catch (err) {
            console.error('Feil ved oppdatering av medlemskap:', err);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Klubber" toggleTheme={() => {}} />

            <TextInput
                style={styles.searchInput}
                placeholder="Søk etter klubber..."
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={handleSearch}
            />

            <View style={styles.clubBox}>
                {loading ? (
                    <ActivityIndicator size="large" color="white" />
                ) : (
                    <FlatList
                        data={clubs}
                        keyExtractor={(item: any) => item._id}
                        contentContainerStyle={{ paddingBottom: 225 }}
                        renderItem={({ item }) => {
                            const isFollowing = followedClubs.includes(item._id);
                            const iconName = isFollowing ? 'minus-circle' : 'plus-circle';
                            const iconColor = isFollowing ? '#e53935' : '#4CAF50';

                            return (
                                <View style={[styles.clubCard, { backgroundColor: item.farge || '#607D8B' }]}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.clubName}>{item.navn}</Text>
                                        <Text style={styles.clubDesc}>{item.beskrivelse}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => toggleFollow(item._id, isFollowing)}>
                                        <View style={styles.iconWrapper}>
                                            <FontAwesome name={iconName} size={28} color="white" style={styles.iconShadow} />
                                            <FontAwesome name={iconName} size={24} color={iconColor} style={styles.icon} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                    />
                )}
            </View>

            <TouchableOpacity style={styles.fixedButton} onPress={() => router.push('/create-klubb')}>
                <Text style={styles.buttonText}>Lag ny Klubb</Text>
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
    searchInput: {
        backgroundColor: '#222',
        color: 'white',
        padding: 10,
        borderRadius: 8,
        marginBottom: 4,
        marginTop: 10,
    },
    fixedButton: {
        position: 'absolute',
        bottom: 92, // over BottomMenu
        left: 20,
        right: 20,
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        zIndex: 10,
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
    clubCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    clubName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    clubDesc: {
        color: 'white',
        marginTop: 4,
    },
    iconWrapper: {
        position: 'relative',
        width: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconShadow: {
        position: 'absolute',
    },
    icon: {
        zIndex: 1,
    },
});
