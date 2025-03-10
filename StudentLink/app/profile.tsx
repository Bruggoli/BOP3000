import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '@/components/Navigation/Navbar';
import BottomMenu from '@/components/Navigation/BottomMenu';

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

const posts = [
    { id: '1', user: 'SneakyTurtle23', text: 'Trenger +1 på Fortnite', location: 'Grivi', theme: 'green' },
    { id: '2', user: 'SneakyTurtle23', text: 'Når er oblig 2 frist i prog??', location: '', theme: 'orange' },
];

export default function Profile() {
    const [selectedAvatar, setSelectedAvatar] = useState(profilePictures[0]);
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);

    const changeAvatar = (avatar: any) => {
        setSelectedAvatar(avatar);
        setAvatarModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Profile" toggleTheme={function (): void {
                throw new Error('Function not implemented.');
            }} />

            {/* Profil-seksjon */}
            <View style={styles.profileSection}>
                <Image source={selectedAvatar} style={styles.avatar} />
                <TouchableOpacity style={styles.editButton} onPress={() => setAvatarModalVisible(true)}>
                    <Ionicons name="create-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <Text style={styles.username}>Navn: <Text style={styles.boldText}>SneakyTurtle23</Text></Text>

            {/* Clubs-knapp */}
            <Text style={styles.sectionTitle}>Clubs:</Text>
            <TouchableOpacity style={styles.clubButton}>
                <Text style={styles.buttonText}>Manage Clubs</Text>
            </TouchableOpacity>

            {/* Innlegg-seksjon */}
            <Text style={styles.sectionTitle}>Posts:</Text>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.postCard, { backgroundColor: item.theme }]}>
                        <View style={styles.postHeader}>
                            <Image source={selectedAvatar} style={styles.postAvatar} />
                            <Text style={styles.boldText}>{item.user}</Text>
                            <TouchableOpacity style={styles.editPostButton}>
                                <Ionicons name="create-outline" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.postText}>{item.text}</Text>
                        <View style={styles.postFooter}>
                            <Ionicons name="chatbubble-outline" size={20} color="black" />
                            <Ionicons name="star-outline" size={20} color="black" />
                            <Ionicons name="car-outline" size={20} color="black" />
                            {item.location ? (
                                <View style={styles.locationContainer}>
                                    <Ionicons name="location-outline" size={16} color="black" />
                                    <Text style={styles.locationText}>{item.location}</Text>
                                </View>
                            ) : null}
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.list}
            />

            {/* Modal for å velge profilbilde */}
            <Modal visible={avatarModalVisible} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Velg et profilbilde</Text>
                        <View style={styles.avatarSelection}>
                            {profilePictures.map((avatar, index) => (
                                <TouchableOpacity key={index} onPress={() => changeAvatar(avatar)}>
                                    <Image source={avatar} style={styles.modalAvatar} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.closeModalButton} onPress={() => setAvatarModalVisible(false)}>
                            <Text style={styles.closeModalText}>Lukk</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* BottomMenu */}
            <BottomMenu />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal: 16,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 20,
        position: 'relative',
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
    postCard: {
        padding: 12,
        borderRadius: 10,
        marginVertical: 8,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    postAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
    },
    postText: {
        color: 'black',
        marginTop: 5,
    },
    postFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'space-between',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        marginLeft: 4,
        fontSize: 14,
        color: 'black',
    },
    list: {
        paddingBottom: 80, // Nok plass til BottomMenu
    },

    // Styles for Avatar Modal
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: '#222',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        color: 'white',
        fontSize: 18,
        marginBottom: 10,
    },
    avatarSelection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 10,
    },
    modalAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        margin: 5,
    },
    closeModalButton: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 5,
    },
    closeModalText: {
        fontWeight: 'bold',
        color: 'black',
    },
    editPostButton: {
        marginLeft: 'auto',
        padding: 5,
    },

});

