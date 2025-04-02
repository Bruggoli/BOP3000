import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import Navbar from '@/components/Navigation/Navbar';
import BottomMenu from '@/components/Navigation/BottomMenu';
import PostCard from '@/components/Posts/PostCard';

const avatarMap: Record<string, any> = {
    'avatar1.png': require('../../assets/avatars/avatar1.png'),
    'avatar2.png': require('../../assets/avatars/avatar2.png'),
    'avatar3.png': require('../../assets/avatars/avatar3.png'),
    'avatar4.png': require('../../assets/avatars/avatar4.png'),
    'avatar5.png': require('../../assets/avatars/avatar5.png'),
    'avatar6.png': require('../../assets/avatars/avatar6.png'),
    'avatar7.png': require('../../assets/avatars/avatar7.png'),
    'avatar8.png': require('../../assets/avatars/avatar8.png'),
    'avatar9.png': require('../../assets/avatars/avatar9.png'),
    'avatar10.png': require('../../assets/avatars/avatar10.png'),
    'avatar11.png': require('../../assets/avatars/avatar11.png'),
    'avatar12.png': require('../../assets/avatars/avatar12.png'),
    'avatar13.png': require('../../assets/avatars/avatar13.png'),
    'avatar14.png': require('../../assets/avatars/avatar14.png'),
    'avatar15.png': require('../../assets/avatars/avatar15.png'),
    'avatar16.png': require('../../assets/avatars/avatar16.png'),
    'avatar17.png': require('../../assets/avatars/avatar17.png'),
};

type Post = {
    _id: string;
    brukerId: string;
    tittel: string;
    innhold: string;
    location?: string;
    klubbId?: string;
    likes: any[];
    kommentarer: any[];
    opprettet: string;
};

export default function PublicProfile() {
    const { id } = useLocalSearchParams();
    const [profile, setProfile] = useState<any>(null);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await fetch(`${process.env.EXPO_PUBLIC_LOCALHOST}/profil/${id}`);
                const profileData = await profileRes.json();
                setProfile(profileData);

                const postRes = await fetch(`${process.env.EXPO_PUBLIC_LOCALHOST}/post`);
                const allPosts = await postRes.json();
                const userPosts = allPosts
                    .filter((post: Post) => post.brukerId === id)
                    .sort((a: Post, b: Post) => new Date(b.opprettet).getTime() - new Date(a.opprettet).getTime());
                setPosts(userPosts);
            } catch (error) {
                console.error('Feil ved lasting av profil eller innlegg:', error);
            }
        };

        if (id) fetchData();
    }, [id]);

    const avatarSource = avatarMap[profile?.icon] || avatarMap['avatar1.png'];

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location={`@${profile?.brukernavn || 'Profil'}`} toggleTheme={() => {}} />

            <View style={styles.profileHeader}>
                <Image source={avatarSource} style={styles.avatar} />
                <Text style={styles.username}>Brukernavn: <Text style={{ fontWeight: 'bold' }}>{profile?.brukernavn || 'Ukjent'}</Text></Text>
                <Text style={styles.postsLabel}>Innlegg fra denne brukeren:</Text>
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <PostCard
                        postId={item._id}
                        userId={item.brukerId}
                        username={profile?.brukernavn || 'Ukjent'}
                        userAvatar={profile?.icon}
                        title={item.tittel}
                        text={item.innhold}
                        location={item.location || ''}
                        color="#555"
                        likes={item.likes?.length || 0}
                        comments={item.kommentarer?.length || 0}
                        timestamp={new Date(item.opprettet).toLocaleString('no-NO', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    />
                )}
                contentContainerStyle={styles.list}
                keyboardShouldPersistTaps="handled"
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
});
