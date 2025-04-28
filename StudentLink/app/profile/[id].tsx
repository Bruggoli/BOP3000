import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import Navbar from '@/components/Navigation/Navbar';
import BottomMenu from '@/components/Navigation/BottomMenu';
import PostCard from '@/components/Posts/PostCard';

const avatarMap: Record<string, any> = {
    'avatar1.jpeg': require('../../assets/avatars/avatar1.jpeg'),
    'avatar2.jpeg': require('../../assets/avatars/avatar2.jpeg'),
    'avatar3.jpeg': require('../../assets/avatars/avatar3.jpeg'),
    'avatar4.jpeg': require('../../assets/avatars/avatar4.jpeg'),
    'avatar5.jpeg': require('../../assets/avatars/avatar5.jpeg'),
    'avatar6.jpeg': require('../../assets/avatars/avatar6.jpeg'),
    'avatar7.jpeg': require('../../assets/avatars/avatar7.jpeg'),
    'avatar8.jpeg': require('../../assets/avatars/avatar8.jpeg'),
    'avatar9.jpeg': require('../../assets/avatars/avatar9.jpeg'),
    'avatar10.jpeg': require('../../assets/avatars/avatar10.jpeg'),
    'avatar11.jpeg': require('../../assets/avatars/avatar11.jpeg'),
    'avatar12.jpeg': require('../../assets/avatars/avatar12.jpeg'),
    'avatar13.jpeg': require('../../assets/avatars/avatar13.jpeg'),
    'avatar14.jpeg': require('../../assets/avatars/avatar14.jpeg'),
    'avatar15.jpeg': require('../../assets/avatars/avatar15.jpeg'),
    'avatar16.jpeg': require('../../assets/avatars/avatar16.jpeg'),
    'avatar17.jpeg': require('../../assets/avatars/avatar17.jpeg'),
};

export default function PublicProfileScreen() {
    const { id } = useLocalSearchParams();
    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [clubs, setClubs] = useState<any[]>([]);
    const server = process.env.EXPO_PUBLIC_LOCALHOST;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, postRes, klubbRes] = await Promise.all([
                    fetch(`${server}/profil/${id}`),
                    fetch(`${server}/post`),
                    fetch(`${server}/klubb`),
                ]);

                const profileData = await profileRes.json();
                const allPosts = await postRes.json();
                const allClubs = await klubbRes.json();

                const brukerensKlubber = allClubs.filter((k: any) =>
                    profileData?.følgerKlubber?.includes(k._id)
                );
                setClubs(brukerensKlubber);
                setProfile(profileData);

                const klubbMap: Record<string, any> = {};
                allClubs.forEach((klubb: any) => {
                    klubbMap[klubb._id] = klubb;
                });

                const brukerensPoster = await Promise.all(
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
                                userAvatar: profileData?.icon || 'avatar1.jpeg',
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
                                    minute: '2-digit',
                                }),
                                createdAt,
                            };
                        })
                );

                const sortedPosts = brukerensPoster.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setPosts(sortedPosts);
            } catch (err) {
                console.error("Feil ved henting av offentlig profil:", err);
            }
        };

        if (id) fetchData();
    }, [id]);

    const avatarSource = avatarMap[profile?.icon] || avatarMap['avatar1.jpeg'];

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Brukerprofil" toggleTheme={() => {}} />

            <View style={styles.profileHeader}>
                <Image source={avatarSource} style={styles.avatar} />
                <Text style={styles.username}>{profile?.brukernavn || 'Ukjent'}</Text>
                {!!profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}
            </View>

            <Text style={styles.sectionTitle}>Fulgte klubber</Text>
            <ScrollView contentContainerStyle={styles.clubList}>
                {clubs.map((club) => (
                    <View
                        key={club._id}
                        style={[styles.clubCard, { backgroundColor: club.farge || '#607D8B' }]}
                    >
                        <Text style={styles.clubName}>{club.navn}</Text>
                        <Text style={styles.clubDesc}>{club.beskrivelse}</Text>
                    </View>
                ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Innlegg</Text>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.postId}
                renderItem={({ item }) => <PostCard {...item} currentUserId="" />}
                contentContainerStyle={styles.postList}
                showsVerticalScrollIndicator={false}
            />

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
        marginBottom: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
    },
    username: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bio: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 6,
        marginTop: 10,
    },
    clubList: {
        paddingBottom: 10,
    },
    clubCard: {
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
    },
    clubName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    clubDesc: {
        color: 'white',
        fontSize: 13,
        marginTop: 2,
    },
    postList: {
        paddingBottom: 100,
    },
});
