import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '@/components/Navigation/Navbar';
import PostCard from '@/components/Posts/PostCard';
import BottomMenu from '@/components/Navigation/BottomMenu';

export default function HomeScreen() {
    const [posts, setPosts] = useState<any[]>([]);
    const [userId, setUserId] = useState('');
    const [profiles, setProfiles] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const loadData = async () => {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId || '');

        try {
            const [postRes, profileRes, klubbRes] = await Promise.all([
                fetch('http://10.0.2.2:3000/post'),
                fetch('http://10.0.2.2:3000/profil'),
                fetch('http://10.0.2.2:3000/klubb'),
            ]);

            const postList = await postRes.json();
            const profileList = await profileRes.json();
            const klubbList = await klubbRes.json();
            setProfiles(profileList);

            const userMap: Record<string, any> = {};
            profileList.forEach((u: any) => {
                userMap[u._id] = u;
            });

            const klubbMap: Record<string, any> = {};
            klubbList.forEach((k: any) => {
                klubbMap[k._id] = k;
            });

            const profile = profileList.find((p: any) => p._id === storedUserId);
            const følgerKlubber = profile?.følgerKlubber?.map((id: any) => id.toString()) || [];

            const postsWithUser = await Promise.all(
                postList
                    .filter((post: any) => !post.klubbId || følgerKlubber.includes(post.klubbId))
                    .map(async (post: any) => {
                        const commentRes = await fetch(`http://10.0.2.2:3000/kommentar/post/${post._id}`);
                        const commentList = await commentRes.json();
                        const klubb = klubbMap[post.klubbId];

                        return {
                            postId: post._id,
                            userId: post.brukerId,
                            username: userMap[post.brukerId]?.brukernavn || 'Ukjent',
                            userAvatar: userMap[post.brukerId]?.icon || 'avatar1.png',
                            title: post.tittel,
                            text: post.innhold,
                            location: post.location || 'Campus Bø',
                            clubName: klubb?.navn || 'New Feed',
                            color: klubb?.farge || '#607D8B',
                            likes: Array.isArray(post.likes) ? post.likes : [],
                            comments: commentList.length,
                            timestamp: new Date(post.opprettet).toLocaleString('no-NO', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                            createdAt: new Date(post.opprettet),
                        };
                    })
            );

            const sorted = postsWithUser.sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            );

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
                keyExtractor={(item) => item.postId}
                renderItem={({ item }) => (
                    <PostCard
                        postId={item.postId}
                        userId={item.userId}
                        username={item.username}
                        userAvatar={item.userAvatar}
                        title={item.title}
                        text={item.text}
                        location={item.location}
                        clubName={item.clubName}
                        color={item.color}
                        likes={item.likes}
                        comments={item.comments}
                        timestamp={item.timestamp}
                        currentUserId={userId}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="white"
                    />
                }
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
