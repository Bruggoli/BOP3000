import "../../global.css";
import React from 'react';
import { Text, View } from 'react-native';
import { verifyInstallation} from "nativewind";
import PostCard from '@/components/ui/PostCard';


const posts = [
    {
        id: 1,
        user: 'Ola Nordmann',
        text: 'noen fra breisås som har bedøk i morra som kjører???',
        location: 'Breisås',

    },
    {
        id: 2,
        user: 'Stine Fine',
        text: 'Plumbo vors på Gulbring !!',
        location: 'Gulbring',
    },
    {
        id: 3,
        user: 'Kultur Kaia',
        text: 'Vi trenger folk til å jobbe Plumbo, vaktsjefene lover å ha utvida!!',
        location: 'Grivi',
    },
];

export default function HomeScreen() {
    // Sjekker om nativewind er installert riktig
    verifyInstallation();
    return (
        //n
        <View className="flex-1">
            {posts.map((post) => (
                <PostCard key={post.id} {...post} />
            ))}
        </View>
    );
}
