import React, { useState, useMemo, useEffect } from 'react';
import { FlatList, StyleSheet, View, Modal, TouchableOpacity, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import Post from '@/components/Posts/Post';
import BottomMenu from '@/components/Navigation/BottomMenu';
import { LocationComp } from '@/components/LocationComp';
import { Ionicons } from '@expo/vector-icons';
import { ObjectId } from "mongodb";
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
    const [menuVisible, setMenuVisible] = useState(false);
    const [posts, setPosts] = useState<MPost[]>([]);
    const [loading, setLoading] = useState(true);
    // @ts-ignore
    const { location, errorMsg } = useState(LocationComp());
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
        <SafeAreaView style={[styles.safeContainer, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>

            {/* Navbar */}
            <View style={styles.navbar}>
                <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={24} color="white" />
                    <Text style={styles.locationText}>Campus Bø</Text>
                </View>

                <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                    <Ionicons name="ellipsis-vertical" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* MODAL FOR MENU */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={menuVisible}
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity style={styles.modalBackground} onPress={toggleMenu}>
                    <View style={[styles.menuContainer, { backgroundColor: themeStyles.menuBackground }]}>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/profile'); }} style={styles.menuItem}>
                            <Text style={[styles.menuText, { color: themeStyles.textColor }]}>Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/clubs'); }} style={styles.menuItem}>
                            <Text style={[styles.menuText, { color: themeStyles.textColor }]}>Clubs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/settings'); }} style={styles.menuItem}>
                            <Text style={[styles.menuText, { color: themeStyles.textColor }]}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleTheme} style={styles.menuItem}>
                            <Text style={[styles.menuText, { color: themeStyles.textColor }]}>Dark / Light Mode</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/terms-of-service'); }} style={styles.menuItem}>
                            <Text style={[styles.menuText, { color: themeStyles.textColor }]}>Terms of Service</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/logout'); }} style={[styles.menuItem, styles.logout, { borderColor: themeStyles.borderColor }]}>
                            <Text style={[styles.menuText, { color: themeStyles.textColor }]}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* FlatList for Posts */}
            <FlatList
                data={posts}
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
            />
            <View style={styles.container}>

                <Text style={styles.paragraph}>{
                    // @ts-ignore
                    location !== null ? location: errorMsg
                }</Text>
            </View>

            {/* BottomMenu */}
            <BottomMenu />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: '#222',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 5,
    },
    menuButton: {
        padding: 5,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    menuContainer: {
        width: 250,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    menuItem: {
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
    },
    logout: {
        borderTopWidth: 1,
        marginTop: 5,
    },
    list: {
        paddingBottom: 80, // 🔹 Viktig! Plass til BottomMenu så siste innlegg ikke skjules
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
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
        color: 'red',
    },
});
