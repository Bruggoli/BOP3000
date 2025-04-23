import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, FlatList, StyleSheet, TouchableOpacity,
    Modal, ScrollView, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Navbar from '@/components/Navigation/Navbar';
import BottomMenu from '@/components/Navigation/BottomMenu';
import PostCard from '@/components/Posts/PostCard';
import { useRouter } from 'expo-router';
import CustomAlert from '@/components/CustomAlert';

const avatarMap: Record<string, any> = {
    'avatar1.png': require('../assets/avatars/avatar1.png'),
    'avatar2.png': require('../assets/avatars/avatar2.png'),
    'avatar3.png': require('../assets/avatars/avatar3.png'),
    'avatar4.png': require('../assets/avatars/avatar4.png'),
    'avatar5.png': require('../assets/avatars/avatar5.png'),
    'avatar6.png': require('../assets/avatars/avatar6.png'),
    'avatar7.png': require('../assets/avatars/avatar7.png'),
    'avatar8.png': require('../assets/avatars/avatar8.png'),
    'avatar9.png': require('../assets/avatars/avatar9.png'),
    'avatar10.png': require('../assets/avatars/avatar10.png'),
    'avatar11.png': require('../assets/avatars/avatar11.png'),
    'avatar12.png': require('../assets/avatars/avatar12.png'),
    'avatar13.png': require('../assets/avatars/avatar13.png'),
    'avatar14.png': require('../assets/avatars/avatar14.png'),
    'avatar15.png': require('../assets/avatars/avatar15.png'),
    'avatar16.png': require('../assets/avatars/avatar16.png'),
    'avatar17.png': require('../assets/avatars/avatar17.png'),
};

export default function Profile() {
    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [userId, setUserId] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);
    const server: string | undefined = process.env.EXPO_PUBLIC_LOCALHOST;
    const [activeTab, setActiveTab] = useState<'posts' | 'clubs'>('posts');
    const [followedClubs, setFollowedClubs] = useState<any[]>([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        loadProfileAndPosts();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (userId) {
                loadProfileAndPosts();
            }
        }, [userId])
    );

    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const loadProfileAndPosts = async () => {
        const id = await AsyncStorage.getItem('userId');
        if (!id) return;
        setUserId(id);

        try {
            const [profileRes, allPostsRes, profileListRes, klubbRes] = await Promise.all([
                fetch(`${server}/profil/${id}`),
                fetch(`${server}/post`),
                fetch(`${server}/profil`),
                fetch(`${server}/klubb`),
            ]);

            const profileData = await profileRes.json();
            const allPosts = await allPostsRes.json();
            const allProfiles = await profileListRes.json();
            const allClubs = await klubbRes.json();

            const brukerensKlubber = allClubs.filter((k: any) =>
                profileData?.følgerKlubber?.includes(k._id)
            );
            setFollowedClubs(brukerensKlubber);
            setProfile(profileData);

            const klubbMap: Record<string, any> = {};
            allClubs.forEach((klubb: any) => {
                klubbMap[klubb._id] = klubb;
            });

            const userPosts = await Promise.all(
                allPosts
                    .filter((post: any) => post.brukerId === id)
                    .map(async (post: any) => {
                        const commentRes = await fetch(`${server}/kommentar/post/${post._id}`);
                        const commentList = await commentRes.json();

                        const createdAt = new Date(post.opprettet);
                        const klubb = klubbMap[post.klubbId];

                        return {
                            postId: post._id,
                            userId: post.brukerId,
                            username: profileData?.brukernavn || 'Ukjent',
                            userAvatar: profileData?.icon || 'avatar1.png',
                            title: post.tittel,
                            text: post.innhold,
                            location: post.location || "Campus Bø",
                            clubName: klubb?.navn || "New Feed",
                            color: klubb?.farge || "#607D8B",
                            likes: Array.isArray(post.likes) ? post.likes : [],
                            comments: commentList.length,
                            timestamp: createdAt.toLocaleString('no-NO', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            createdAt
                        };
                    })
            );

            const sorted = userPosts.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setPosts(sorted);
        } catch (error) {
            console.error('Feil ved lasting av profil eller innlegg:', error);
            showAlert("Feil", "Kunne ikke laste profil eller innlegg");
        }
    };

    const avatarSource = avatarMap[profile?.icon] || avatarMap['avatar1.png'];

    const handleAvatarChange = async (newIcon: string) => {
        try {
            const res = await fetch(`${server}/profil/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ icon: newIcon }),
            });

            const data = await res.json();
            if (res.ok) {
                setProfile((prev: any) => ({ ...prev, icon: newIcon }));
                setModalVisible(false);
                showAlert("Profilbilde oppdatert", `Du valgte ${newIcon}`);
            } else {
                showAlert("Feil", data?.error || "Ukjent feil");
            }
        } catch (err) {
            console.error('Kunne ikke oppdatere ikon:', err);
            showAlert("Nettverksfeil", "Klarte ikke å koble til serveren");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Profil" toggleTheme={() => {}} />

            <View style={styles.profileHeader}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image source={avatarSource} style={styles.avatar} />
                </TouchableOpacity>
                <Text style={styles.username}>{profile?.brukernavn || 'Ukjent'}</Text>

                <View style={styles.tabButtons}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'posts' && styles.activeTab]}
                        onPress={() => setActiveTab('posts')}
                    >
                        <Text style={styles.tabText}>Dine innlegg</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'clubs' && styles.activeTab]}
                        onPress={() => setActiveTab('clubs')}
                    >
                        <Text style={styles.tabText}>Fulgte klubber</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {activeTab === 'posts' ? (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.postId}
                    renderItem={({ item }) => <PostCard {...item} currentUserId={userId} />}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <ScrollView contentContainerStyle={styles.clubList}>
                    {followedClubs.map((club) => (
                        <View
                            key={club._id}
                            style={[styles.clubCard, { backgroundColor: club.farge || '#607D8B' }]}
                        >
                            <Text style={styles.clubName}>{club.navn}</Text>
                            <Text style={styles.clubDesc}>{club.beskrivelse}</Text>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/clubs')}>
                        <Text style={styles.exploreText}>Oppdag flere klubber</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}

            <Modal visible={modalVisible} animationType="slide">
                <SafeAreaView style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Velg et nytt profilbilde</Text>
                    <ScrollView contentContainerStyle={styles.avatarPicker}>
                        {Object.keys(avatarMap).map((iconName) => (
                            <TouchableOpacity key={iconName} onPress={() => handleAvatarChange(iconName)}>
                                <Image
                                    source={avatarMap[iconName]}
                                    style={[styles.avatarOption, iconName === profile?.icon && styles.selectedAvatar]}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={{ color: 'white', textAlign: 'center', marginTop: 10 }}>Lukk</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>

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
    container: { flex: 1, backgroundColor: '#121212', padding: 20 },
    profileHeader: { alignItems: 'center', marginBottom: 15, marginTop: 12 },
    avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
    username: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    tabButtons: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
    tabButton: {
        backgroundColor: '#333', paddingVertical: 8,
        paddingHorizontal: 16, marginHorizontal: 4, borderRadius: 20,
    },
    activeTab: { backgroundColor: '#4CAF50' },
    tabText: { color: 'white', fontWeight: 'bold' },
    list: { paddingBottom: 80 },
    clubList: { paddingBottom: 100 },
    clubCard: { borderRadius: 10, padding: 12, marginVertical: 6 },
    clubName: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    clubDesc: { color: 'white', marginTop: 4 },
    exploreButton: {
        backgroundColor: '#4CAF50', marginTop: 20,
        padding: 12, borderRadius: 8, alignItems: 'center',
    },
    exploreText: { color: 'white', fontWeight: 'bold' },
    avatarPicker: {
        flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'center', padding: 10,
    },
    avatarOption: {
        width: 50, height: 50, borderRadius: 25,
        margin: 5, borderWidth: 2, borderColor: 'transparent',
    },
    selectedAvatar: { borderColor: 'white' },
    modalContainer: { flex: 1, backgroundColor: '#121212', paddingTop: 30 },
    modalTitle: { color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 10 },
});
