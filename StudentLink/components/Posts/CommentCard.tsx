import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import ReportModal from '@/components/Posts/ReportModal';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from '@/components/CustomAlert';

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
    const avatarSource = userAvatar ? avatarMap[userAvatar] : avatarMap['avatar1.png'];
    const [localLikes, setLocalLikes] = useState<string[]>(likes);
    const hasLiked = localLikes.includes(currentUserId);
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

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
            showAlert("Feil", "Kunne ikke like/unlike kommentaren");
        }
    };

    const sendReport = async (reason: string) => {
        try {
            const userEmail = await AsyncStorage.getItem('userEmail');
            const res = await fetch(`${process.env.EXPO_PUBLIC_LOCALHOST}/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kommentarId: commentId,
                    reportedBy: currentUserId,
                    reason,
                    reporterEmail: userEmail,
                    kommentarText: text,
                }),
            });

            const result = await res.json();
            if (res.ok) {
                showAlert("Takk!", "Rapporten er sendt.");
            } else {
                showAlert("Feil", result?.error || "Kunne ikke sende rapport.");
            }
        } catch (error) {
            showAlert("Feil", "Kunne ikke sende rapport.");
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.userRow}>
                    <TouchableOpacity onPress={() => router.push({ pathname: '/profile/[id]' as const, params: { id: userId } })}>
                        <Image source={avatarSource} style={styles.avatar} />
                    </TouchableOpacity>
                    <Text style={styles.username}>{username}</Text>
                </View>
                <Text style={styles.timestamp}>{timestamp}</Text>
            </View>

            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginLeft: 'auto' }}>
                <FontAwesome name="flag" size={18} color="white" />
            </TouchableOpacity>

            <Text style={styles.text}>{text}</Text>

            <View style={styles.iconRow}>
                <TouchableOpacity onPress={handleLike} style={styles.iconGroup}>
                    <FontAwesome name={hasLiked ? "star" : "star-o"} size={18} color="white" />
                    <Text style={styles.iconText}>{localLikes.length > 0 ? localLikes.length : ""}</Text>
                </TouchableOpacity>
            </View>

            <ReportModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={(reason) => sendReport(reason)}
            />

            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
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
