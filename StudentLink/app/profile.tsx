import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, FlatList, StyleSheet, TouchableOpacity,
    Modal, ScrollView, TextInput
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
    const [activeTab, setActiveTab] = useState<'posts' | 'clubs'>('posts');
    const [followedClubs, setFollowedClubs] = useState<any[]>([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [bioModalVisible, setBioModalVisible] = useState(false);
    const [newBio, setNewBio] = useState('');
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
            const [profileRes, allPostsRes, klubbRes] = await Promise.all([
                fetch(`http://10.0.2.2:3000/profil/${id}`),
                fetch('http://10.0.2.2:3000/post'),
                fetch('http://10.0.2.2:3000/klubb'),
            ]);

            const profileData = await profileRes.json();
            const allPosts = await allPostsRes.json();
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
                        const commentRes = await fetch(`http://10.0.2.2:3000/kommentar/post/${post._id}`);
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

    const handleBioUpdate = async () => {
        if (newBio.length > 150) {
            showAlert("Bio er for lang", "Maks 150 tegn er tillatt.");
            return;
        }

        try {
            const res = await fetch(`http://10.0.2.2:3000/profil/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bio: newBio }),
            });

            if (res.ok) {
                setProfile((prev: any) => ({ ...prev, bio: newBio }));
                setBioModalVisible(false);
                showAlert("Bio oppdatert", "Din bio er lagret.");
            } else {
                showAlert("Feil", "Kunne ikke oppdatere bio");
            }
        } catch (err) {
            showAlert("Feil", "Ukjent feil oppstod");
        }
    };

    const avatarSource = avatarMap[profile?.icon] || avatarMap['avatar1.png'];

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Profil" toggleTheme={() => {}} />

            <View style={styles.profileHeader}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image source={avatarSource} style={styles.avatar} />
                </TouchableOpacity>
                <Text style={styles.username}>{profile?.brukernavn || 'Ukjent'}</Text>

                {profile?.bio && (
                    <TouchableOpacity style={styles.bioContainer} onPress={() => {
                        setNewBio(profile.bio);
                        setBioModalVisible(true);
                    }}>
                        <Text style={styles.bioText}>{profile.bio}</Text>
                    </TouchableOpacity>
                )}

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

            <FlatList
                data={posts}
                keyExtractor={(item) => item.postId}
                renderItem={({ item }) => <PostCard {...item} currentUserId={userId} />}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            <Modal visible={bioModalVisible} animationType="slide" transparent>
                <View style={styles.bioModalOverlay}>
                    <View style={styles.bioModal}>
                        <Text style={styles.modalTitle}>Rediger bio</Text>
                        <TextInput
                            style={styles.bioInput}
                            multiline
                            maxLength={150}
                            value={newBio}
                            onChangeText={setNewBio}
                            placeholder="Skriv noe om deg selv..."
                            placeholderTextColor="#aaa"
                        />
                        <View style={styles.bioModalButtons}>
                            <TouchableOpacity onPress={handleBioUpdate} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>Lagre</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setBioModalVisible(false)}>
                                <Text style={{ color: 'white', marginTop: 10 }}>Avbryt</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
    username: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
    bioContainer: {
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    bioText: {
        color: '#ccc',
        fontStyle: 'italic',
        fontSize: 14,
        textAlign: 'center',
    },
    tabButtons: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
    tabButton: {
        backgroundColor: '#333', paddingVertical: 8,
        paddingHorizontal: 16, marginHorizontal: 4, borderRadius: 20,
    },
    activeTab: { backgroundColor: '#4CAF50' },
    tabText: { color: 'white', fontWeight: 'bold' },
    bioModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bioModal: {
        backgroundColor: '#1e1e1e',
        padding: 20,
        borderRadius: 12,
        width: '90%',
    },
    modalTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    bioInput: {
        backgroundColor: '#2c2c2c',
        color: 'white',
        borderRadius: 8,
        padding: 12,
        minHeight: 100,
        textAlignVertical: 'top',
        marginTop: 10,
    },
    bioModalButtons: {
        alignItems: 'center',
        marginTop: 16,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
