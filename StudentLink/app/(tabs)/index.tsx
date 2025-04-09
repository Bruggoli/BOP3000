import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    Text,
    Modal,
    Pressable,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '@/components/Navigation/Navbar';
import PostCard from '@/components/Posts/PostCard';
import BottomMenu from '@/components/Navigation/BottomMenu';
import { FontAwesome } from '@expo/vector-icons';
import CustomAlert from '@/components/CustomAlert';

export default function HomeScreen() {
    const [posts, setPosts] = useState<any[]>([]);
    const [userId, setUserId] = useState('');
    const [profiles, setProfiles] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [klubber, setKlubber] = useState<any[]>([]);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string>('newfeed+følger');
    const [currentProfile, setCurrentProfile] = useState<any>(null);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        loadData();
    }, [activeFilter]);

    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

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
            setKlubber(klubbList);

            const userMap: Record<string, any> = {};
            profileList.forEach((u: any) => {
                userMap[u._id] = u;
            });

            const klubbMap: Record<string, any> = {};
            klubbList.forEach((k: any) => {
                klubbMap[k._id] = k;
            });

            const profile = profileList.find((p: any) => p._id === storedUserId);
            setCurrentProfile(profile);
            const følgerKlubber = profile?.følgerKlubber?.map((id: any) => id.toString()) || [];

            const filteredPosts = postList.filter((post: any) => {
                const klubbId = post.klubbId;
                const klubbIdStr = klubbId?.toString();

                if (activeFilter === 'newfeed') return !klubbId;
                if (activeFilter === 'alle') return true;
                if (activeFilter === 'newfeed+følger') return !klubbId || følgerKlubber.includes(klubbIdStr);
                return klubbIdStr === activeFilter;
            });

            const postsWithUser = await Promise.all(
                filteredPosts.map(async (post: any) => {
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
            showAlert('Feil', 'Kunne ikke laste innlegg. Prøv igjen senere.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Hjem" toggleTheme={() => {}} />

            <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
                <FontAwesome name="filter" size={20} color="white" />
                <Text style={styles.filterButtonText}>Filter</Text>
            </TouchableOpacity>

            {/* Modal for filtrering */}
            <Modal visible={filterModalVisible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filtrer innlegg</Text>
                        <ScrollView>
                            {[
                                { key: 'newfeed', label: 'Kun New Feed' },
                                { key: 'alle', label: 'Alle innlegg' },
                                ...klubber
                                    .filter((k) =>
                                        currentProfile?.følgerKlubber?.some(
                                            (id: any) => id.toString() === k._id.toString()
                                        )
                                    )
                                    .map((k) => ({
                                        key: k._id.toString(),
                                        label: k.navn,
                                    })),
                            ].map((filter) => (
                                <Pressable
                                    key={filter.key}
                                    onPress={() => {
                                        setActiveFilter(filter.key);
                                        setFilterModalVisible(false);
                                    }}
                                    style={[
                                        styles.filterOption,
                                        filter.key === activeFilter && styles.activeFilterOption,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.filterOptionText,
                                            filter.key === activeFilter && styles.activeFilterOptionText,
                                        ]}
                                    >
                                        {filter.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                            <Text style={{ textAlign: 'center', color: 'white', marginTop: 10 }}>Lukk</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#444',
        alignSelf: 'flex-end',
        marginRight: 20,
        marginTop: 10,
        padding: 8,
        borderRadius: 8,
        gap: 6,
    },
    filterButtonText: {
        color: 'white',
        fontSize: 14,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    modalContent: {
        backgroundColor: '#121212',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    filterOption: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    filterOptionText: {
        color: '#ccc',
        fontSize: 16,
    },
    activeFilterOption: {
        backgroundColor: '#333',
    },
    activeFilterOptionText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
