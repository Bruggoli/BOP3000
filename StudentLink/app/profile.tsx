import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Navbar from '@/components/Navigation/Navbar';
import BottomMenu from '@/components/Navigation/BottomMenu';
import PostCard from '@/components/Posts/PostCard'; // 🚀 Bruker PostCard-komponenten

const profilePictures = [
    require('@/assets/avatars/avatar1.png'),
    require('@/assets/avatars/avatar2.png'),
    require('@/assets/avatars/avatar3.png'),
    require('@/assets/avatars/avatar4.png'),
    require('@/assets/avatars/avatar5.png'),
    require('@/assets/avatars/avatar6.png'),
    require('@/assets/avatars/avatar7.png'),
    require('@/assets/avatars/avatar8.png'),
];

// 🚀 Tilpasset testdata som matcher PostCard-props
const posts = [
    {
        postId: '1',
        userId: 'SneakyTurtle23',
        username: 'SneakyTurtle23',
        text: 'Trenger +1 på Fortnite',
        location: 'Grivi',
        color: 'green',
        likes: 10,
        comments: 4,
    },
    {
        postId: '2',
        userId: 'SneakyTurtle23',
        username: 'SneakyTurtle23',
        text: 'Når er oblig 2 frist i prog??',
        location: '',
        color: 'orange',
        likes: 3,
        comments: 1,
    },
    {
        postId: '3',
        userId: 'SneakyTurtle23',
        username: 'SneakyTurtle23',
        text: 'Noen som vil ha gratis pizza?',
        location: 'Campus',
        color: 'blue',
        likes: 12,
        comments: 5,
    },
    {
        postId: '4',
        userId: 'SneakyTurtle23',
        username: 'SneakyTurtle23',
        text: 'Trening kl. 18:00 i dag!',
        location: '',
        color: 'red',
        likes: 8,
        comments: 2,
    },
];

export default function Profile() {
    const [selectedAvatar, setSelectedAvatar] = useState(profilePictures[0]);
    const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Profile" toggleTheme={() => {}} />

            <FlatList
                data={posts}
                keyExtractor={(item) => item.postId}
                ListHeaderComponent={(
                    <View style={styles.profileBox}>
                        <View style={styles.profileSection}>
                            <Image source={selectedAvatar} style={styles.avatar} />
                            <TouchableOpacity style={styles.editButton} onPress={() => setAvatarModalVisible(true)}>
                                <Ionicons name="create-outline" size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.username}>
                            Navn: <Text style={styles.boldText}>SneakyTurtle23</Text>
                        </Text>

                        <Text style={styles.sectionTitle}>Clubs:</Text>
                        <TouchableOpacity style={styles.clubButton} onPress={() => router.push('/clubs')}>
                            <Text style={styles.buttonText}>Manage Clubs</Text>
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>Posts:</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <PostCard
                        postId={item.postId}
                        userId={item.userId}
                        username={item.username}
                        text={item.text}
                        location={item.location}
                        color={item.color}
                        likes={item.likes}
                        comments={item.comments}
                        userAvatar={selectedAvatar.uri} // 🚀 Bruker valgt avatar
                    />
                )}
                contentContainerStyle={styles.list}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            />

            <BottomMenu />

            {/* 🚀 Modal for å velge profilbilde */}
            <Modal
                visible={isAvatarModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setAvatarModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Velg et profilbilde</Text>
                        <FlatList
                            data={profilePictures}
                            numColumns={4}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => {
                                    setSelectedAvatar(item);
                                    setAvatarModalVisible(false);
                                }}>
                                    <Image source={item} style={styles.modalAvatar} />
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setAvatarModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Lukk</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    profileBox: {
        backgroundColor: '#222',
        borderRadius: 12,
        padding: 20,
        marginBottom: 10,
    },
    profileSection: {
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        backgroundColor: '#444',
        padding: 5,
        borderRadius: 20,
    },
    username: {
        color: 'white',
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
    },
    boldText: {
        fontWeight: 'bold',
    },
    sectionTitle: {
        color: 'white',
        fontSize: 16,
        marginTop: 15,
    },
    clubButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 5,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'black',
    },
    list: {
        paddingBottom: 80,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        margin: 5,
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#222',
        padding: 10,
        borderRadius: 8,
    },
});
