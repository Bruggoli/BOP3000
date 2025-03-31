import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Navbar from "@/components/Navigation/Navbar";
import BottomMenu from "@/components/Navigation/BottomMenu";
import PostCard from "@/components/Posts/PostCard";

export default function HomeScreen() {
    const [posts, setPosts] = useState<MappedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});

    useFocusEffect(
        React.useCallback(() => {
            fetchEverything();
        }, [])
    );

    const fetchEverything = async () => {
        try {
            const [postRes, profileRes, klubbRes] = await Promise.all([
                fetch('http://10.0.2.2:3000/post'),
                fetch('http://10.0.2.2:3000/profil'),
                fetch('http://10.0.2.2:3000/klubb'),
            ]);

            const rawPosts = await postRes.json();
            const profileList: UserProfile[] = await profileRes.json();
            const klubbList: Klubb[] = await klubbRes.json();

            const profileMap: Record<string, UserProfile> = {};
            profileList.forEach(profile => {
                profileMap[profile._id.toString()] = profile;
            });

            const klubbMap: Record<string, Klubb> = {};
            klubbList.forEach(klubb => {
                klubbMap[klubb._id.toString()] = klubb;
            });

            const formatted = rawPosts
                .map((post: any) => {
                    const brukerIdStr = post.brukerId?.toString();
                    const profil = profileMap[brukerIdStr];
                    const klubb = klubbMap[post.klubbId?.toString()];
                    const createdAt = new Date(post.opprettet);
                    const timestamp = `${createdAt.getDate().toString().padStart(2, '0')}.${(createdAt.getMonth() + 1).toString().padStart(2, '0')} kl. ${createdAt.getHours().toString().padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}`;

                    return {
                        postId: post._id?.toString(),
                        userId: brukerIdStr,
                        username: profil?.brukernavn || brukerIdStr,
                        userAvatar: profil?.icon || 'avatar1.png',
                        title: post.tittel,
                        text: post.innhold,
                        location: post.location || "Campus Bø",
                        clubName: klubb?.navn || "New Feed",
                        color: getColorByClub(post.klubbId),
                        likes: Array.isArray(post.likes) ? post.likes : [],
                        comments: Array.isArray(post.kommentarer) ? post.kommentarer.length : 0,
                        timestamp: timestamp,
                        createdAt: createdAt,
                    };
                })
                .sort((a: MappedPost, b: MappedPost) => b.createdAt.getTime() - a.createdAt.getTime());

            setProfiles(profileMap);
            setPosts(formatted);
        } catch (error) {
            console.error("Feil ved lasting av poster eller profiler:", error);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="light-content" />
            <Navbar location="Hjem" toggleTheme={() => {}} />

            <FlatList
                data={posts}
                keyExtractor={(item) => item.postId}
                renderItem={({ item }) => <PostCard {...item} currentUserId={item.userId} />}
                ListEmptyComponent={<Text style={styles.noPosts}>Ingen innlegg funnet.</Text>}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            />

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
    currentUserId?: string;
};

type UserProfile = {
    _id: string;
    brukernavn: string;
    icon?: string;
};

type Klubb = {
    _id: string;
    navn: string;
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
});
