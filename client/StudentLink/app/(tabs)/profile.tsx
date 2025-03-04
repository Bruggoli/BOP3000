import "../../global.css";
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import PostCard from '@/components/ui/PostCard';

export default function ProfileScreen() {
    return (
        <View className="flex-1 bg-black p-4 items-center">
            <Image source={{ uri: 'https://via.placeholder.com/100' }} className="w-24 h-24 rounded-full" />
            <Text className="text-white text-lg font-bold mt-4">SneakyTurtle23</Text>
            <Text className="text-white mt-2">Clubs:</Text>
            <View className="flex-row gap-2 mt-2">
                <Pressable className="bg-gray-700 p-2 rounded-lg">
                    <Text className="text-white">Manage Clubs</Text>
                </Pressable>
                <Pressable className="bg-gray-700 p-2 rounded-lg">
                    <Text className="text-white">Make New Club</Text>
                </Pressable>
            </View>
            <Text className="text-white mt-4">Posts:</Text>
            <PostCard user="SneakyTurtle23" text="Trenger +1 på Fortnite" location="Grivi" />
            <PostCard user="SneakyTurtle23" text="Når er er oblig 2 frist i prog??" location="" />
        </View>
    );
}
