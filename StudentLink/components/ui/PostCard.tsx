import React from 'react';
import { View, Text } from 'react-native';

// Definer props-typen
type PostProps = {
    user: string;
    text: string;
    location?: string;
};

const PostCard: React.FC<PostProps> = ({ user, text, location }) => (
    <View className={"w-100 h-50 !bg-blue-500"}>
        <Text style={{ color: 'red' }}>{user}</Text>
        <Text className="!text-purple-600" style={{ color: 'green' }}>{text}</Text>
            {location && <Text>📍 {location}</Text>}
    </View>
);

export default PostCard;