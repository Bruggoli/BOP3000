import React from 'react';
import { View, Text } from 'react-native';

// Definer props-typen
type PostProps = {
    user: string;
    text: string;
    location?: string;
    color: string;
};

const PostCard: React.FC<PostProps> = ({ user, text, location, color }) => (
    <View className={`p-4 m-2 rounded-lg ${color}`}>
        <Text className="text-white font-bold">{user}</Text>
        <Text className="text-white">{text}</Text>
            {location && <Text className="text-white text-xs mt-2">📍 {location}</Text>}
    </View>
);

export default PostCard;