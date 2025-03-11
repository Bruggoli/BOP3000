import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
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
    { id: '3', user: 'SneakyTurtle23', text: 'Noen som vil ha gratis pizza?', location: 'Campus', theme: 'blue' },
    { id: '4', user: 'SneakyTurtle23', text: 'Trening kl. 18:00 i dag!', location: '', theme: 'red' },
];

export default function Profile() {
    const [selectedAvatar, setSelectedAvatar] = useState(profilePictures[0]);

    return (
        <SafeAreaView style={styles.container}>
            <Navbar location="Profile" toggleTheme={() => {}} />

            {/* 🚀 Bruk ScrollView for å gjøre siden rullbar */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <View style={styles.profileBox}>
                    <View style={styles.profileSection}>
                        <Image source={selectedAvatar} style={styles.avatar} />
                        <TouchableOpacity style={styles.editButton}>
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
                </View>

                {/* 🚀 FlatList må være utenfor profileBox for å være scrollbar */}
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={[styles.postCard, { backgroundColor: item.theme }]}>
                            <View style={styles.postHeader}>
                                <Image source={selectedAvatar} style={styles.postAvatar} />
                                <Text style={styles.boldText}>{item.user}</Text>
                            </View>
                            <Text style={styles.postText}>{item.text}</Text>
                            <View style={styles.postFooter}>
                                <Ionicons name="chatbubble-outline" size={20} color="black" />
                                <Ionicons name="star-outline" size={20} color="black" />
                            </View>
                        </View>
                    )}
                    contentContainerStyle={styles.list}
                    keyboardShouldPersistTaps="handled"
                />

            </ScrollView>

            <BottomMenu />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    profileBox: {
        backgroundColor: '#222',
        borderRadius: 12,
        padding: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
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
    list: {
        paddingBottom: 80, // Gir plass til BottomMenu
    },
});
