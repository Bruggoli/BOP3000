import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BottomMenu from '@/components/Navigation/BottomMenu';
import Navbar from '@/components/Navigation/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '@/components/CustomAlert';

type Club = {
    _id: string;
    navn: string;
    beskrivelse: string;
    farge?: string;
};

export default function ClubsScreen() {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [userId, setUserId] = useState('');
    const [followedClubIds, setFollowedClubIds] = useState<string[]>([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        loadUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchClubs();
        }
    }, [userId]);

    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const loadUserId = async () => {
        const id = await AsyncStorage.getItem('userId');
        if (id) setUserId(id);
    };

    const fetchClubs = async (query = '') => {
        try {
            setLoading(true);
            const [res, profileRes] = await Promise.all([
                fetch(`http://10.0.2.2:3000/klubb?q=${query}`),
                fetch(`http://10.0.2.2:3000/profil/${userId}`)
            ]);
            const data = await res.json();
            const profile = await profileRes.json();
            setClubs(data);
            setFollowedClubIds((profile?.følgerKlubber || []).map((id: any) => id.toString()));
        } catch (error) {
            console.error('Feil ved henting av klubber:', error);
            showAlert("Feil", "Kunne ikke hente klubber.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        fetchClubs(query);
    };

    const toggleFollow = async (klubbId: string, isFollowing: boolean) => {
        try {
            const endpoint = isFollowing ? 'sluttfolg' : 'folg';
            const response = await fetch(`http://10.0.2.2:3000/klubb/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brukerId: userId, klubbId })
            });

            if (response.ok) {
                fetchClubs(); // Oppdater liste etter endring
            } else {
                showAlert("Feil", "Klarte ikke å oppdatere følgerstatus.");
            }
        } catch (error) {
            console.error('❌ Feil ved følgehandling:', error);
            showAlert("Feil", "Noe gikk galt ved oppdatering.");
        }
    };

    const renderClubItem = ({ item }: { item: Club }) => {
        const isFollowing = followedClubIds.includes(item._id.toString());

        return (
            <View style={[styles.clubCard, { backgroundColor: item.farge || '#607D8B' }]}>
                <View style={styles.clubHeader}>
                    <Text style={styles.clubName}>{item.navn}</Text>
                    <TouchableOpacity
                        style={[styles.followButton, isFollowing && styles.unfollowButton]}
                        onPress={() => toggleFollow(item._id.toString(), isFollowing)}
                    >
                        <Text style={styles.followButtonText}>
                            {isFollowing ? 'Slutt å følg' : 'Følg'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.clubDescription}>{item.beskrivelse}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Klubber" toggleTheme={() => {}} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <TextInput
                    style={styles.searchInput}
                    placeholder="Søk etter klubber..."
                    placeholderTextColor="#ccc"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />

                {loading ? (
                    <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={clubs}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={renderClubItem}
                        contentContainerStyle={{ paddingBottom: 140 }}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </KeyboardAvoidingView>

            <TouchableOpacity style={styles.createButton} onPress={() => router.push('/create-klubb')}>
                <Text style={styles.buttonText}>Lag ny Klubb</Text>
            </TouchableOpacity>

            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />

            <BottomMenu />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal: 20
    },
    searchInput: {
        backgroundColor: '#222',
        color: 'white',
        padding: 12,
        borderRadius: 10,
        marginTop: 12,
        marginBottom: 10,
        fontSize: 16,
        borderColor: '#444',
        borderWidth: 1
    },
    createButton: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        zIndex: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    clubCard: {
        borderRadius: 12,
        padding: 16,
        marginVertical: 8
    },
    clubHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    clubName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
    clubDescription: {
        color: 'white',
        marginTop: 8,
        fontSize: 14
    },
    followButton: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20
    },
    unfollowButton: {
        backgroundColor: '#FF5252'
    },
    followButtonText: {
        color: '#121212',
        fontWeight: 'bold',
        fontSize: 12
    }
});
