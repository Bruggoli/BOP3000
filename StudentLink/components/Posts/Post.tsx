import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const themeColors: { [key: string]: string } = {
    red: '#FF6B6B',
    blue: '#5F75FF',
    green: '#4CD964',
    orange: '#FFA726',
    purple: '#9C27B0',
    pink: '#FF2D55',
    yellow: '#FFEE58',
    brown: '#795548',
    grey: '#9E9E9E',
    black: '#000',
    white: '#FFF',
    cyan: '#00BCD4',
};

export default function Post({ post }: { post: { user: string; text: string; location: string; theme: string } }) {
    return (
        <View style={[styles.postContainer, { backgroundColor: themeColors[post.theme] || '#DDD' }]}>
            <Text style={styles.user}>{post.user}</Text>
            <Text style={styles.text}>{post.text}</Text>
            {post.location ? <Text style={styles.location}>📍 {post.location}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        padding: 15,
        borderRadius: 20, // Økt for mer avrunding
        marginBottom: 15, // Mer mellomrom mellom kortene
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, // Skyggeeffekt
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // Skygge på Android
    },
    user: {
        fontWeight: 'bold',
        fontSize: 18, // Større navn
        color: '#fff',
        marginBottom: 4,
    },
    text: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 6,
    },
    location: {
        fontSize: 14,
        color: '#f2f2f2',
    },
});
