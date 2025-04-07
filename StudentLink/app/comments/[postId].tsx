import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostCard from '@/components/Posts/PostCard';
import Navbar from '@/components/Navigation/Navbar';
import BottomMenu from '@/components/Navigation/BottomMenu';

export default function CommentScreen() {
    const { postId, color } = useLocalSearchParams();
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [userId, setUserId] = useState('');
    const [profiles, setProfiles] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId || '');

        const [postRes, commentsRes, profilesRes, klubbRes] = await Promise.all([
            fetch(`http://10.0.2.2:3000/post/${postId}`),
            fetch(`http://10.0.2.2:3000/kommentar/post/${postId}`),
            fetch('http://10.0.2.2:3000/profil'),
            fetch('http://10.0.2.2:3000/klubb'),
        ]);

        const postData = await postRes.json();
        const commentList = await commentsRes.json();
        const profileList = await profilesRes.json();
        const klubbList = await klubbRes.json();

        setProfiles(profileList);

        const userMap: Record<string, any> = {};
        profileList.forEach((u: any) => {
            userMap[u._id] = u;
        });

        const klubbMap: Record<string, string> = {};
        klubbList.forEach((k: any) => {
            klubbMap[k._id] = k.navn;
        });

        const klubbNavn = postData.klubbId ? klubbMap[postData.klubbId] || 'New Feed' : 'New Feed';

        const formattedPost = {
            postId: postData._id,
            userId: postData.brukerId,
            username: userMap[postData.brukerId]?.brukernavn || 'Ukjent',
            userAvatar: userMap[postData.brukerId]?.icon || 'avatar1.png',
            title: postData.tittel,
            text: postData.innhold,
            location: postData.location || 'Campus Bø',
            clubName: klubbNavn,
            color: color as string,
            likes: postData.likes || [],
            comments: commentList.length,
            timestamp: new Date(postData.opprettet).toLocaleString('no-NO', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            }),
        };

        const formattedComments = commentList
            .sort((a: any, b: any) => new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime())
            .map((kommentar: any) => ({
                postId: kommentar._id,
                userId: kommentar.brukerId,
                username: userMap[kommentar.brukerId]?.brukernavn || 'Ukjent',
                userAvatar: userMap[kommentar.brukerId]?.icon || 'avatar1.png',
                title: '',
                text: kommentar.tekst,
                location: '',
                clubName: '',
                color: color as string,
                likes: kommentar.likes || [],
                comments: 0,
                timestamp: new Date(kommentar.opprettet).toLocaleString('no-NO', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            }));

        setPost(formattedPost);
        setComments(formattedComments);
    };

    const handleSendComment = async () => {
        if (!newComment.trim()) return;

        try {
            await fetch('http://10.0.2.2:3000/kommentar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId,
                    brukerId: userId,
                    tekst: newComment,
                }),
            });

            setNewComment('');
            loadData(); // Oppdater kommentarlisten
        } catch (err) {
            console.error("Feil ved sending av kommentar:", err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Kommentarer" toggleTheme={() => {}} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={100}
            >
                <FlatList
                    ListHeaderComponent={() => post && <PostCard {...post} currentUserId={userId} />}
                    data={comments}
                    keyExtractor={(item) => item.postId}
                    renderItem={({ item }) => <PostCard {...item} currentUserId={userId} />}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Skriv en kommentar..."
                        placeholderTextColor="#999"
                        value={newComment}
                        onChangeText={setNewComment}
                        onSubmitEditing={handleSendComment}
                        returnKeyType="send"
                    />
                </View>
            </KeyboardAvoidingView>

            <BottomMenu />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    list: {
        paddingBottom: 100,
    },
    inputContainer: {
        backgroundColor: '#1f1f1f',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    input: {
        backgroundColor: '#2c2c2c',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        color: 'white',
    },
});
