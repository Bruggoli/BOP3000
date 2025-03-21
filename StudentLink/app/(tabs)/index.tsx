import React from 'react';
import { FlatList, StyleSheet, View, StatusBar, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PostCard from '@/components/Posts/PostCard';
import BottomMenu from '@/components/Navigation/BottomMenu';
import Navbar from '@/components/Navigation/Navbar'; // 🚀 LEGG TIL DETTE

const posts = [
    {
        postId: '1',
        userId: '101',
        username: 'Ola Nordmann',
        text: 'Noen fra Breisås som har bedøk i morra som kjører???',
        location: 'Breisås',
        color: '#FF6B6B',
        likes: 8,
        comments: 2,
    },
    {
        postId: '2',
        userId: '102',
        username: 'Stine Fine',
        text: 'Plumbo vors på Gulbring !!',
        location: 'Gulbring',
        color: '#5F75FF',
        likes: 15,
        comments: 5,
    },
    {
        postId: '3',
        userId: '103',
        username: 'Adrian Ro',
        text: 'Æ E Fyllesjuk!!',
        location: 'Gulbring',
        color: '#FFA726',
        likes: 3,
        comments: 1,
    },
];

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="light-content" />

            {/* 🚀 Bruk Navbar her */}
            <Navbar location="Hjem" toggleTheme={() => {}} />

            <FlatList
                data={posts}
                keyExtractor={(item) => item.postId}
                renderItem={({ item }) => <PostCard {...item} />}
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
});
