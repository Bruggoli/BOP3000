import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '@/components/Navigation/Navbar';
import PostCard from '@/components/Posts/PostCard';
import BottomMenu from '@/components/Navigation/BottomMenu';

export default function HomeScreen() {
    const [posts, setPosts] = useState<any[]>([]);
    const [userId, setUserId] = useState('');
    const [profiles, setProfiles] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId || '');

        try {
            const [postRes, profileRes] = await Promise.all([
                fetch('http://10.0.2.2:3000/post'),
                fetch('http://10.0.2.2:3000/profil'),
            ]);

            const postList = await postRes.json();
            const profileList = await profileRes.json();
            setProfiles(profileList);

            const userMap: Record<string, any> = {};
            profileList.forEach((u: any) => {
                userMap[u._id] = u;
            });

            const postsWithUser = await Promise.all(
                postList.map(async (post: any) => {
                    const commentRes = await fetch(`http://10.0.2.2:3000/kommentar/post/${post._id}`);
                    const commentList = await commentRes.json();

                    return {
                        ...post,
                        username: userMap[post.brukerId]?.brukernavn || 'Ukjent',
                        userAvatar: userMap[post.brukerId]?.icon || 'avatar1.png',
                        location: post.location || 'Campus Bø',
                        clubName: 'New Feed',
                        timestamp: new Date(post.opprettet).toLocaleString('no-NO', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                        commentCount: commentList.length,
                    };
                })
            );

            const sorted = postsWithUser.sort((a, b) => new Date(b.opprettet).getTime() - new Date(a.opprettet).getTime());
            setPosts(sorted);
        } catch (err) {
            console.error('Feil ved lasting av innlegg:', err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Hjem" toggleTheme={() => {}} />

            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <PostCard
                        postId={item._id}
                        userId={item.brukerId}
                        username={item.username}
                        userAvatar={item.userAvatar}
                        title={item.tittel}
                        text={item.innhold}
                        location={item.location}
                        clubName={item.clubName}
                        color="#444"
                        likes={item.likes || []}
                        comments={item.commentCount} // ✅ viser riktig antall kommentarer
                        timestamp={item.timestamp}
                        currentUserId={userId}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 120 }}
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
    },
});
