import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const avatarMap: Record<string, any> = {
    'avatar1.jpeg': require('../../assets/avatars/avatar1.jpeg'),
    'avatar2.jpeg': require('../../assets/avatars/avatar2.jpeg'),
    'avatar3.jpeg': require('../../assets/avatars/avatar3.jpeg'),
    'avatar4.jpeg': require('../../assets/avatars/avatar4.jpeg'),
    'avatar5.jpeg': require('../../assets/avatars/avatar5.jpeg'),
    'avatar6.jpeg': require('../../assets/avatars/avatar6.jpeg'),
    'avatar7.jpeg': require('../../assets/avatars/avatar7.jpeg'),
    'avatar8.jpeg': require('../../assets/avatars/avatar8.jpeg'),
    'avatar9.jpeg': require('../../assets/avatars/avatar9.jpeg'),
    'avatar10.jpeg': require('../../assets/avatars/avatar10.jpeg'),
    'avatar11.jpeg': require('../../assets/avatars/avatar11.jpeg'),
    'avatar12.jpeg': require('../../assets/avatars/avatar12.jpeg'),
    'avatar13.jpeg': require('../../assets/avatars/avatar13.jpeg'),
    'avatar14.jpeg': require('../../assets/avatars/avatar14.jpeg'),
    'avatar15.jpeg': require('../../assets/avatars/avatar15.jpeg'),
    'avatar16.jpeg': require('../../assets/avatars/avatar16.jpeg'),
    'avatar17.jpeg': require('../../assets/avatars/avatar17.jpeg'),
};

type Props = {
    commentId: string;
    userId: string;
    username: string;
    userAvatar?: string;
    text: string;
    timestamp: string;
    likes: string[];
    currentUserId: string;
};

export default function CommentCard({
                                        commentId,
                                        userId,
                                        username,
                                        userAvatar,
                                        text,
                                        timestamp,
                                        likes,
                                        currentUserId,
                                    }: Props) {
    const avatarSource = userAvatar ? avatarMap[userAvatar] : avatarMap['avatar1.jpeg'];
    const [localLikes, setLocalLikes] = useState<string[]>(likes);
    const hasLiked = localLikes.includes(currentUserId);

    const handleLike = async () => {
        try {
            await fetch(`http://10.0.2.2:3000/kommentar/${commentId}/like`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brukerId: currentUserId }),
            });

            setLocalLikes((prevLikes) =>
                prevLikes.includes(currentUserId)
                    ? prevLikes.filter(id => id !== currentUserId)
                    : [...prevLikes, currentUserId]
            );
        } catch (err) {
            console.error("Kunne ikke like/unlike kommentaren:", err);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.userRow}>
                    <Image source={avatarSource} style={styles.avatar} />
                    <Text style={styles.username}>{username}</Text>
                </View>
                <Text style={styles.timestamp}>{timestamp}</Text>
            </View>

            <Text style={styles.text}>{text}</Text>

            <View style={styles.iconRow}>
                <TouchableOpacity onPress={handleLike} style={styles.iconGroup}>
                    <FontAwesome name={hasLiked ? "star" : "star-o"} size={18} color="white" />
                    <Text style={styles.iconText}>{localLikes.length > 0 ? localLikes.length : ""}</Text>
                </TouchableOpacity>
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
        backgroundColor: '#333',
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
    text: {
        color: 'white',
        marginBottom: 6,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
});
