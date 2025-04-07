import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, StatusBar, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from "@/components/Navigation/Navbar";
import BottomMenu from "@/components/Navigation/BottomMenu";
import PostCard from "@/components/Posts/PostCard";
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
    const [posts, setPosts] = useState<MappedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
    const [clubs, setClubs] = useState<Klubb[]>([]);
    const [filter, setFilter] = useState<string | null>(null);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [followedClubs, setFollowedClubs] = useState<string[]>([]);
    const [userId, setUserId] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            fetchEverything();
        }, [filter])
    );

    const fetchEverything = async () => {
        setLoading(true);
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (!storedUserId) return;
            setUserId(storedUserId);

            const [postRes, profileRes, klubbRes] = await Promise.all([
                fetch('http://10.0.2.2:3000/post'),
                fetch('http://10.0.2.2:3000/profil'),
                fetch('http://10.0.2.2:3000/klubb'),
            ]);

            const rawPosts = await postRes.json();
            const profileList: UserProfile[] = await profileRes.json();
            const klubbList: Klubb[] = await klubbRes.json();
            setClubs(klubbList);

            const profileMap: Record<string, UserProfile> = {};
            profileList.forEach(profile => {
                profileMap[profile._id] = profile;
            });

            const userProfile = profileList.find(p => p._id === storedUserId);
            const følger = userProfile?.følgerKlubber?.map((id: any) => id.toString()) || [];
            setFollowedClubs(følger);

            const klubbMap: Record<string, Klubb> = {};
            klubbList.forEach(klubb => {
                klubbMap[klubb._id] = klubb;
            });

            const filteredPosts = rawPosts
                .filter((post: any) => {
                    const klubbId = post.klubbId?.toString();

                    if (filter === "new") {
                        return !klubbId; // kun innlegg uten klubb
                    }

                    if (filter === null) {
                        return !klubbId || følger.includes(klubbId); // alle fulgte + new feed
                    }

                    return klubbId === filter; // spesifikk klubb
                })
                .map((post: any) => {
                    const brukerIdStr = post.brukerId?.toString();
                    const profil = profileMap[brukerIdStr];
                    const klubb = klubbMap[post.klubbId];
                    const createdAt = new Date(post.opprettet);
                    const timestamp = `${createdAt.getDate().toString().padStart(2, '0')}.${(createdAt.getMonth() + 1).toString().padStart(2, '0')} kl. ${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}`;

                    return {
                        postId: post._id,
                        userId: brukerIdStr,
                        username: profil?.brukernavn || "Ukjent",
                        userAvatar: profil?.icon || 'avatar1.png',
                        title: post.tittel,
                        text: post.innhold,
                        location: post.location || "Campus Bø",
                        clubName: klubb?.navn || "New Feed",
                        color: klubb?.farge || "#7f0f92",
                        likes: post.likes || [],
                        comments: Array.isArray(post.kommentarer) ? post.kommentarer.length : 0,
                        timestamp,
                        createdAt,
                    };
                })
                .sort((a: MappedPost, b: MappedPost) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

            setProfiles(profileMap);
            setPosts(filteredPosts);
        } catch (err) {
            console.error("❌ Feil ved lasting:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFilterModal = () => setFilterModalVisible(!filterModalVisible);

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="light-content" />
            <Navbar location="Hjem" toggleTheme={() => {}} />

            <TouchableOpacity style={styles.filterButton} onPress={toggleFilterModal}>
                <Ionicons name="funnel-outline" size={24} color="white" />
                <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>

            <FlatList
                data={posts}
                keyExtractor={(item) => item.postId}
                renderItem={({ item }) => <PostCard {...item} currentUserId={userId} />}
                ListEmptyComponent={<Text style={styles.noPosts}>Ingen innlegg funnet.</Text>}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            />

            <Modal visible={filterModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => { setFilter(null); toggleFilterModal(); }}>
                            <Text style={styles.modalItem}>Alle innlegg</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setFilter("new"); toggleFilterModal(); }}>
                            <Text style={styles.modalItem}>New Feed</Text>
                        </TouchableOpacity>
                        {clubs
                            .filter(c => followedClubs.includes(c._id))
                            .map(club => (
                                <TouchableOpacity key={club._id} onPress={() => { setFilter(club._id); toggleFilterModal(); }}>
                                    <Text style={styles.modalItem}>{club.navn}</Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                </View>
            </Modal>

            <BottomMenu />
        </SafeAreaView>
    );
}

type MappedPost = {
    postId: string;
    userId: string;
    username: string;
    userAvatar?: string;
    title: string;
    text: string;
    location: string;
    clubName: string;
    color: string;
    likes: string[];
    comments: number;
    timestamp: string;
    createdAt: Date;
};

type UserProfile = {
    _id: string;
    brukernavn: string;
    icon?: string;
    følgerKlubber?: string[];
};

type Klubb = {
    _id: string;
    navn: string;
    farge?: string;
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#121212',
    },
    list: {
        paddingBottom: 80,
    },
    noPosts: {
        textAlign: 'center',
        color: 'white',
        marginTop: 20,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 10,
        margin: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    filterText: {
        color: 'white',
        marginLeft: 8,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#121212', // svart bakgrunn
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalItem: {
        fontSize: 16,
        paddingVertical: 10,
        color: 'white', // hvit tekst
    },
});
