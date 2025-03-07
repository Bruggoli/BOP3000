import React from 'react';
import { View } from 'react-native';
import PostCard from '@/components/ui/PostCard';
import { Button } from 'react-native';
require('dotenv').config();

const posts = [
    {
        id: 1,
        user: 'Ola Nordmann',
        text: 'noen fra breisås som har bedøk i morra som kjører???',
        location: 'Breisås',
        color: 'bg-red-500',
    },
    {
        id: 2,
        user: 'Stine Fine',
        text: 'Plumbo vors på Gulbring !!',
        location: 'Gulbring',
        color: 'bg-blue-500',
    },
    {
        id: 3,
        user: 'Kultur Kaia',
        text: 'Vi trenger folk til å jobbe Plumbo, vaktsjefene lover å ha utvida!!',
        location: 'Grivi',
        color: 'bg-green-500',
    },
];

async function hentPosts() {
  const res = await fetch(process.env.LOCALHOST + `/klubb`);
  const data = await res.json();
  console.log("data fetched" + data.navn);
}

export default function HomeScreen() {
    return (
        <View className="flex-1 bg-black p-4">
            {posts.map((post) => (
                <PostCard key={post.id} {...post} />
            ))}
            <Button title={"Hent"} onPress={() => hentPosts()}/>
        </View>
    );
}
