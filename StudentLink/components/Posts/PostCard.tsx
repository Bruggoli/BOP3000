import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

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

type Props = {
    postId: string;
    userId: string;
    username: string;
    userAvatar?: string;
    title: string;
    text: string;
    location: string;
    clubName: string;
    color: string;
    likes: string[];
    comments: number;
    timestamp: string;
    currentUserId: string;
};

export default function PostCard({
                                     postId,
                                     username,
                                     userAvatar,
                                     title,
                                     text,
                                     location,
                                     clubName,
                                     color,
                                     likes,
                                     comments,
                                     timestamp,
                                     currentUserId,
                                 }: Props) {
    const avatarSource = userAvatar ? avatarMap[userAvatar] : avatarMap['avatar1.png'];
    const [localLikes, setLocalLikes] = useState<string[]>(likes);
    const hasLiked = localLikes.includes(currentUserId);

    const handleLike = async () => {
        try {
            await fetch(`http://10.0.2.2:3000/post/${postId}/like`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brukerId: currentUserId }),
            });

            // Oppdater lokalt
            setLocalLikes((prevLikes) =>
                prevLikes.includes(currentUserId)
                    ? prevLikes.filter(id => id !== currentUserId)
                    : [...prevLikes, currentUserId]
            );
        } catch (err) {
            console.error("Kunne ikke like/unlike posten:", err);
        }
    };

    return (
        <View style={[styles.card, { backgroundColor: color }]}>
            <View style={styles.headerRow}>
                <View style={styles.userRow}>
                    <Image source={avatarSource} style={styles.avatar} />
                    <Text style={styles.username}>{username}</Text>
                </View>
                <Text style={styles.timestamp}>{timestamp}</Text>
            </View>

            <View style={styles.titleRow}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity>
                    <FontAwesome name="flag" size={18} color="black" />
                </TouchableOpacity>
            </View>

            <Text style={styles.text}>{text}</Text>

            <View style={styles.iconRow}>
                <View style={styles.iconGroup}>
                    <TouchableOpacity onPress={handleLike}>
                        <FontAwesome name={hasLiked ? "star" : "star-o"} size={18} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.iconText}>{localLikes.length > 0 ? localLikes.length : ""}</Text>
                </View>
                <View style={styles.iconGroup}>
                    <FontAwesome name="comment-o" size={18} color="white" />
                    <Text style={styles.iconText}>{comments > 0 ? comments : ""}</Text>
                </View>
                <Text style={styles.clubText}>{clubName} • {location}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        padding: 12,
        marginHorizontal: 10,
        marginVertical: 6,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
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
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 16,
        flex: 1,
    },
    text: {
        color: 'white',
        marginBottom: 6,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },
    iconGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    iconText: {
        color: 'white',
        marginLeft: 4,
    },
    clubText: {
        color: 'white',
        fontSize: 12,
    },
});
