import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Text,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostCard from '@/components/Posts/PostCard';
import Navbar from '@/components/Navigation/Navbar';
import BottomMenu from '@/components/Navigation/BottomMenu';
import CustomAlert from '@/components/CustomAlert';
import CommentCard from "@/components/Posts/CommentCard";

export default function CommentScreen() {
    const { postId, color } = useLocalSearchParams();
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [userId, setUserId] = useState('');
    const [profiles, setProfiles] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const [commentSuccess, setCommentSuccess] = useState(false);
    const successAnim = useState(new Animated.Value(0))[0];
    const server = process.env.EXPO_PUBLIC_LOCALHOST;

    useEffect(() => {
        loadData();
    }, []);

    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const showSuccess = () => {
        setCommentSuccess(true);
        Animated.timing(successAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                Animated.timing(successAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => setCommentSuccess(false));
            }, 1500);
        });
    };

    const loadData = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            setUserId(storedUserId || '');

            const [postRes, commentsRes, profilesRes, klubbRes] = await Promise.all([
                fetch(`${server}/post/${postId}`),
                fetch(`${server}/kommentar/post/${postId}`),
                fetch(`${server}/profil`),
                fetch(`${server}/klubb`),
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
        } catch (err) {
            console.error("Feil ved lasting av data:", err);
            showAlert("Feil", "Klarte ikke å laste kommentarer eller innlegg.");
        }
    };

    const handleSendComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`${server}/kommentar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId,
                    brukerId: userId,
                    tekst: newComment,
                }),
            });

            if (response.ok) {
                setNewComment('');
                showSuccess();
                loadData(); // Oppdater kommentarlisten
            } else {
                showAlert("Feil", "Kunne ikke legge til kommentar.");
            }
        } catch (err) {
            console.error("Feil ved sending av kommentar:", err);
            showAlert("Feil", "En uventet feil oppstod.");
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
                    renderItem={({ item }) => (
                        <CommentCard
                            commentId={item.postId}
                            userId={item.userId}
                            username={item.username}
                            userAvatar={item.userAvatar}
                            text={item.text}
                            timestamp={item.timestamp}
                            likes={item.likes}
                            currentUserId={userId}
                        />
                    )}
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
                        returnKeyType="send"
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendComment}>
                        <Text style={styles.sendText}>Post</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {commentSuccess && (
                <Animated.View style={[styles.successPopup, { opacity: successAnim }]}>
                    <Text style={styles.successText}>Kommentar lagt til!</Text>
                </Animated.View>
            )}

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
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    list: {
        paddingBottom: 100,
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#1f1f1f',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 88,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#2c2c2c',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        color: 'white',
    },
    sendButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginLeft: 10,
        alignSelf: 'center',
    },
    sendText: {
        color: 'white',
        fontWeight: 'bold',
    },
    successPopup: {
        position: 'absolute',
        bottom: 140,
        alignSelf: 'center',
        backgroundColor: '#2e7d32',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 16,
    },
    successText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
