import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type PostProps = {
    postId: string;
    userId: string;
    username: string;
    text: string;
    location?: string;
    color: string;
    likes: number;
    comments: number;
    userAvatar?: string;
};

const PostCard: React.FC<PostProps> = ({ postId, userId, username, text, location, color, likes, comments, userAvatar }) => {
    const router = useRouter();

    return (
        <View style={{ padding: 12, margin: 8, borderRadius: 10, backgroundColor: color }}>
            {/* Øvre seksjon med profilbilde og brukernavn */}
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }} onPress={() => router.push(`/profile/${userId}`)}>
                <Image
                    source={{ uri: userAvatar || `https://your-api.com/users/${userId}/avatar` }}
                    style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
                />
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{username}</Text>
            </TouchableOpacity>

            {/* Innleggstekst */}
            <Text style={{ color: 'white', marginBottom: 5 }}>{text}</Text>
            {location && <Text style={{ color: 'white', fontSize: 12 }}>📍 {location}</Text>}

            {/* Knappeseksjon */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="star-outline" size={20} color="white" />
                    <Text style={{ color: 'white', marginLeft: 4 }}>{likes}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="chatbubble-outline" size={20} color="white" />
                    <Text style={{ color: 'white', marginLeft: 4 }}>{comments}</Text>
                </TouchableOpacity>

                {location && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="location-outline" size={20} color="white" />
                        <Text style={{ color: 'white', marginLeft: 4 }}>Sted</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default PostCard;
