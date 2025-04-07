import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '@/components/Navigation/Navbar';
import PostCard from '@/components/Posts/PostCard';
import CommentCard from '@/components/Posts/CommentCard';
import BottomMenu from '@/components/Navigation/BottomMenu';

export default function CommentScreen() {
    const { postId } = useLocalSearchParams();
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [userId, setUserId] = useState('');
    const [userProfile, setUserProfile] = useState<any>(null);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        if (postId) {
            loadData();
        }
    }, [postId]);

    const loadData = async () => {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId || '');

        try {
            const [postRes, commentRes, profileRes] = await Promise.all([
                fetch(`http://10.0.2.2:3000/post/${postId}`),
                fetch(`http://10.0.2.2:3000/kommentar/post/${postId}`),
                fetch('http://10.0.2.2:3000/profil'),
            ]);

            const postData = await postRes.json();
            const commentList = await commentRes.json();
            const profileList = await profileRes.json();

            const userMap: Record<string, any> = {};
            profileList.forEach((u: any) => {
                userMap[u._id] = u;
                if (u._id === storedUserId) setUserProfile(u);
            });

            const sortedComments = commentList.sort(
                (a: any, b: any) => new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime()
            );

            setPost({
                ...postData,
                username: userMap[postData.brukerId]?.brukernavn || 'Ukjent',
                userAvatar: userMap[postData.brukerId]?.icon || 'avatar1.png',
                location: postData.location || 'Campus Bø',
                clubName: 'New Feed',
                timestamp: new Date(postData.opprettet).toLocaleString('no-NO', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            });

            setComments(
                sortedComments.map((c: any) => ({
                    ...c,
                    username: userMap[c.brukerId]?.brukernavn || 'Ukjent',
                    userAvatar: userMap[c.brukerId]?.icon || 'avatar1.png',
                    timestamp: new Date(c.opprettet).toLocaleString('no-NO', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }))
            );
        } catch (err) {
            console.error('Feil ved lasting av post eller kommentarer:', err);
        }
    };

    const handleSubmitComment = async () => {
        if (!commentText.trim()) return;

        try {
            const res = await fetch('http://10.0.2.2:3000/kommentar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId,
                    brukerId: userId,
                    tekst: commentText.trim(),
                }),
            });

            if (res.ok) {
                setCommentText('');
                loadData(); // Oppdater kommentarlisten
            } else {
                Alert.alert('Feil', 'Kunne ikke sende kommentar');
            }
        } catch (err) {
            console.error('Feil ved innsending av kommentar:', err);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <SafeAreaView style={styles.container}>
                <Navbar location="Kommentarer" toggleTheme={() => {}} />

                {post && (
                    <PostCard
                        postId={post._id}
                        userId={post.brukerId}
                        username={post.username}
                        userAvatar={post.userAvatar}
                        title={post.tittel}
                        text={post.innhold}
                        location={post.location}
                        clubName={post.clubName}
                        color="#444"
                        likes={post.likes || []}
                        comments={post.kommentarer?.length || 0}
                        timestamp={post.timestamp}
                        currentUserId={userId}
                    />
                )}

                <FlatList
                    data={comments}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <CommentCard
                            commentId={item._id}
                            userId={item.brukerId}
                            username={item.username}
                            userAvatar={item.userAvatar}
                            text={item.tekst}
                            timestamp={item.timestamp}
                            likes={item.likes || []}
                            currentUserId={userId}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 150 }}
                    ListEmptyComponent={<Text style={styles.noComments}>Ingen kommentarer enda.</Text>}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.commentInputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={commentText}
                        onChangeText={setCommentText}
                        placeholder="Skriv en kommentar..."
                        placeholderTextColor="#999"
                        multiline
                    />
                    <TouchableOpacity onPress={handleSubmitComment} style={styles.sendButton}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>

                <BottomMenu />
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    noComments: {
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
    commentInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#333',
        backgroundColor: '#222',
        marginBottom: Platform.OS === 'ios' ? 86 : 91, // 👈 litt høyere nå
    },
    input: {
        flex: 1,
        backgroundColor: '#333',
        color: 'white',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
