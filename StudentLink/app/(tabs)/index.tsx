import React, { useState, useMemo, useEffect } from 'react';
import { FlatList, StyleSheet, View, Modal, TouchableOpacity, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import Post from '@/components/Posts/Post';
import BottomMenu from '@/components/Navigation/BottomMenu';
import { Ionicons } from '@expo/vector-icons';
import { ObjectId } from "mongodb";
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
    const [menuVisible, setMenuVisible] = useState(false);
    const [posts, setPosts] = useState<MPost[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            const fetchPosts = async () => {
                try {
                    const response = await fetch('http://10.0.2.2:3000/post');
                    if (!response.ok) {
                        throw new Error(`HTTP-feil! Status: ${response.status}`);
                    }

                    const data = await response.json();
                    setPosts(data);
                } catch (error) {
                    console.error('Feil ved henting av poster:', error);
                }
            };

            fetchPosts();
        }, [])
    );

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://10.0.2.2:3000/post');
                if (!response.ok) {
                    throw new Error(`HTTP-feil! Status: ${response.status}`);
                }

                const data: MPost[] = await response.json();

                // Konverter ObjectId til string og formater datoer
                const formattedData = data.map(post => ({
                    ...post,
                    _id: post._id?.toString(),
                    brukerId: post.brukerId.toString(),
                    opprettet: new Date(post.opprettet).toLocaleString(),
                    kommentarer: post.kommentarer?.map(kom => ({
                        ...kom,
                        brukerId: kom.brukerId.toString(),
                        opprettet: new Date(kom.opprettet).toLocaleString(),
                    })) || []
                }));

                console.log("Hentede poster:", formattedData);
                setPosts(formattedData);
            } catch (error) {
                console.error('Feil ved henting av poster:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);


    interface MPost {
        _id?: string; // ObjectId lagres som string i frontend
        brukerId: string;
        tittel: string;
        innhold: string;
        likes?: string[];
        kommentarer?: { brukerId: string; tekst: string; opprettet: string }[];
        opprettet: string;
    }



    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const themeStyles = useMemo(() => ({
        menuBackground: isDarkMode ? '#333' : 'white',
        textColor: isDarkMode ? 'white' : '#000',
        borderColor: isDarkMode ? '#555' : '#ccc',
    }), [isDarkMode]);


    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="light-content" />

            {/* 🚀 Bruk Navbar her */}
            <Navbar location="Hjem" toggleTheme={() => {}} />

            <FlatList
                data={posts}
                keyExtractor={(item) => item.postId}
                renderItem={({ item }) => <PostCard {...item} />}
                keyExtractor={(item) => item._id!} // ObjectId som string
                renderItem={({ item }) => (
                    <View style={styles.postContainer}>
                        <Text style={styles.postTitle}>{item.tittel}</Text>
                        <Text style={styles.postContent}>{item.innhold}</Text>
                        <Text style={styles.postTimestamp}>{item.opprettet}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.noPosts}>Ingen innlegg funnet.</Text>}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            />


            <BottomMenu />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#121212',
    },
    list: {
        paddingBottom: 80,
    },

    //midlertidlig ccs
        postContainer: {
            backgroundColor: '#222',
            padding: 15,
            marginVertical: 10,
            borderRadius: 10,
        },
        postTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: 'white',
        },
        postContent: {
            fontSize: 14,
            color: '#ccc',
            marginTop: 5,
        },
        postTimestamp: {
            fontSize: 12,
            color: '#777',
            marginTop: 10,
            textAlign: 'right',
        },
        noPosts: {
            textAlign: 'center',
            color: 'white',
            marginTop: 20,
        },
    });
