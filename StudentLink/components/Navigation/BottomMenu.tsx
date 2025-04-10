import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

export default function BottomMenu() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
                    <Ionicons name="flame-outline" size={40} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.createButton} onPress={() => router.push('/create-post')}>
                    <Ionicons name="add-circle" size={40} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.createButton} onPress={() => router.push('/profile')}>
                    <Ionicons name="person-outline" size={40} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: screenWidth, // Sikrer at menyen dekker hele bredden
        backgroundColor: '#222',
    },
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 15,
        width: '100%', // Viktig for full bredde
        backgroundColor: '#222',
    },
    button: {
        padding: 10,
    },
    createButton: {
        padding: 10,
    },
});
