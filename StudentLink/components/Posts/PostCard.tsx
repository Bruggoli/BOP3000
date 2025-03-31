import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const avatarMap: Record<string, any> = {
    'avatar1.png': require('../../assets/avatars/avatar1.png'),
    'avatar2.png': require('../../assets/avatars/avatar2.png'),
    'avatar3.png': require('../../assets/avatars/avatar3.png'),
    'avatar4.png': require('../../assets/avatars/avatar4.png'),
    'avatar5.png': require('../../assets/avatars/avatar5.png'),
    'avatar6.png': require('../../assets/avatars/avatar6.png'),
    'avatar7.png': require('../../assets/avatars/avatar7.png'),
    'avatar8.png': require('../../assets/avatars/avatar8.png'),
    'avatar9.png': require('../../assets/avatars/avatar9.png'),
    'avatar10.png': require('../../assets/avatars/avatar10.png'),
    'avatar11.png': require('../../assets/avatars/avatar11.png'),
    'avatar12.png': require('../../assets/avatars/avatar12.png'),
    'avatar13.png': require('../../assets/avatars/avatar13.png'),
    'avatar14.png': require('../../assets/avatars/avatar14.png'),
    'avatar15.png': require('../../assets/avatars/avatar15.png'),
    'avatar16.png': require('../../assets/avatars/avatar16.png'),
    'avatar17.png': require('../../assets/avatars/avatar17.png'),
};

export default function PostCard({
                                     postId,
                                     userId,
                                     username,
                                     userAvatar,
                                     title,
                                     text,
                                     location,
                                     color,
                                     likes,
                                     comments,
                                     timestamp,
                                 }: any) {
    const router = useRouter();
    const avatarSource = avatarMap[userAvatar] || avatarMap['avatar1.png'];

    return (
        <View style={[styles.card, { backgroundColor: color }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push(`/profile/${userId}`)} style={styles.userInfo}>
                    <Image source={avatarSource} style={styles.avatar} />
                    <Text style={styles.username}>{username}</Text>
                </TouchableOpacity>
                <Text style={styles.timestamp}>{timestamp}</Text>
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{text}</Text>

            <View style={styles.footer}>
                <View style={styles.iconRow}>
                    <FontAwesome name="star-o" size={18} color="white" />
                    <Text style={styles.iconText}>{likes}</Text>
                </View>
                <View style={styles.iconRow}>
                    <FontAwesome name="comment-o" size={18} color="white" />
                    <Text style={styles.iconText}>{comments}</Text>
                </View>
                {location && (
                    <View style={styles.iconRow}>
                        <FontAwesome name="map-marker" size={18} color="white" />
                        <Text style={styles.iconText}>{location}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 12,
        marginVertical: 6,
        marginHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
    },
    username: {
        fontWeight: 'bold',
        color: 'white',
    },
    timestamp: {
        color: 'white',
        fontSize: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 4,
    },
    text: {
        color: 'white',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 16,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    iconText: {
        color: 'white',
        marginLeft: 4,
    },
});
