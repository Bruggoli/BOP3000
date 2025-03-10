import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BottomMenu() {
    const router = useRouter();

    return (
        <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
                <Ionicons name="flame-outline" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.createButton} onPress={() => router.push('/create-post')}>
                <Ionicons name="add-circle" size={40} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#222',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    button: {
        padding: 10,
    },
    createButton: {
        padding: 10,
    },
});
