import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Navbar from '@/components/Navigation/Navbar';
import BottomMenu from '@/components/Navigation/BottomMenu';
import PostCard from '@/components/Posts/PostCard';

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

export default function Profile() {
    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<MappedPost[]>([]);
    const [userId, setUserId] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);

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

    const getColorByClub = (klubbId?: string) => {
        const clubColors: Record<string, string> = {
            "klubb1": "#4CAF50",
            "klubb2": "#2196F3",
            "klubb3": "#FFC107",
        };

        if (!klubbId) {
            const randomColors = ["#FF7043", "#AB47BC", "#29B6F6", "#66BB6A", "#FFCA28"];
            return randomColors[Math.floor(Math.random() * randomColors.length)];
        }

        return clubColors[klubbId] || "#607D8B";
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
            const klubbList = await klubbRes.json();

            setProfile(profileData);

            const klubbMap: Record<string, any> = {};
            klubbList.forEach((k: any) => {
                klubbMap[k._id.toString()] = k;
            });

            const userPosts: MappedPost[] = allPosts
                .filter((post: any) => post.brukerId === id)
                .map((post: any) => {
                    const klubb = klubbMap[post.klubbId?.toString()];
                    const createdAt = new Date(post.opprettet);

                    return {
                        postId: post._id,
                        userId: post.brukerId,
                        username: profileData?.brukernavn || 'Ukjent',
                        userAvatar: profileData?.icon || 'avatar1.png',
                        title: post.tittel,
                        text: post.innhold,
                        location: post.location || "Campus Bø",
                        clubName: klubb?.navn || "New Feed",
                        color: getColorByClub(post.klubbId),
                        likes: Array.isArray(post.likes) ? post.likes : [],
                        comments: Array.isArray(post.kommentarer) ? post.kommentarer.length : 0,
                        timestamp: createdAt.toLocaleString('no-NO', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        createdAt
                    };
                })
                .sort((a: MappedPost, b: MappedPost) => b.createdAt.getTime() - a.createdAt.getTime());

            setPosts(userPosts);
        } catch (error) {
            console.error('Feil ved lasting av profil eller innlegg:', error);
        }
    };

    const avatarSource = avatarMap[profile?.icon] || avatarMap['avatar1.png'];

    const handleAvatarChange = async (newIcon: string) => {
        try {
            const res = await fetch(`http://10.0.2.2:3000/profil/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ icon: newIcon }),
            });

            const data = await res.json();

            if (res.ok) {
                setProfile((prev: any) => ({ ...prev, icon: newIcon }));
                setModalVisible(false);
                Alert.alert("Profilbilde oppdatert", `Du valgte ${newIcon}`);
            } else {
                Alert.alert("Feil", data?.error || "Ukjent feil");
            }
        } catch (err) {
            console.error('Kunne ikke oppdatere ikon:', err);
            Alert.alert("Nettverksfeil", "Klarte ikke å koble til serveren");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Profil" toggleTheme={() => {}} />

            <View style={styles.profileHeader}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image source={avatarSource} style={styles.avatar} />
                </TouchableOpacity>
                <Text style={styles.username}>Brukernavn: <Text style={{ fontWeight: 'bold' }}>{profile?.brukernavn || 'Ukjent'}</Text></Text>
                <Text style={styles.postsLabel}>Dine innlegg:</Text>
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item) => item.postId}
                renderItem={({ item }) => (
                    <PostCard {...item} currentUserId={userId} />
                )}
                contentContainerStyle={styles.list}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            />

            <Modal visible={modalVisible} animationType="slide">
                <SafeAreaView style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Velg et nytt profilbilde</Text>
                    <ScrollView contentContainerStyle={styles.avatarPicker}>
                        {Object.keys(avatarMap).map((iconName) => (
                            <TouchableOpacity
                                key={iconName}
                                onPress={() => handleAvatarChange(iconName)}
                            >
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
    profileHeader: {
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    username: {
        color: 'white',
        fontSize: 18,
        marginBottom: 4,
    },
    postsLabel: {
        color: 'white',
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
    },
    list: {
        paddingBottom: 80,
    },
    avatarPicker: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 10,
    },
    avatarOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 5,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedAvatar: {
        borderColor: 'white',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: 30,
    },
    modalTitle: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
});
