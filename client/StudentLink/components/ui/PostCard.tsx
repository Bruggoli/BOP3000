import styles from "../../global.css";
import React from 'react';
import { View, Text } from 'react-native';

// Definer props-typen
type PostProps = {
    user: string;
    text: string;
    location?: string;
};

const PostCard: React.FC<PostProps> = ({ user, text, location }) => (
    <View>
        <Text style={{ color: 'red' }}>{user}</Text>
        <Text className="!text-purple-600" style={{ color: 'green' }}>{text}</Text>
            {location && <Text>📍 {location}</Text>}
    </View>
);

export default PostCard;