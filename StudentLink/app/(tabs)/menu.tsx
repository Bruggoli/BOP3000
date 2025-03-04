import "../../global.css";
import React from 'react';
import { View, Text } from 'react-native';

export default function MenuScreen() {
    return (
        <View className="flex-1">
            <Text className="text-white text-lg font-bold">Settings</Text>
            <Text className="text-white mt-4">- Terms & Service</Text>
            <Text className="text-white mt-2">- Your Car</Text>
            <Text className="text-white mt-2">- Log out</Text>
            <Text className="text-red-500 mt-4">Delete account</Text>
        </View>
    );
}
