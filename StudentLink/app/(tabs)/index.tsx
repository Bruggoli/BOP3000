import React, { useState, useMemo, useEffect } from 'react';
import { FlatList, StyleSheet, View, Modal, TouchableOpacity, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import Post from '@/components/Posts/Post';
import BottomMenu from '@/components/Navigation/BottomMenu';
import { LocationComp } from '@/components/LocationComp';
import { Ionicons } from '@expo/vector-icons';

const posts = [
    { id: '1', user: 'Ola Nordmann', text: 'Noen fra Breisås som har bedøk i morra som kjører???', location: 'Breisås', theme: 'red' },
    { id: '2', user: 'Stine Fine', text: 'Plumbo vors på Gulbring !!', location: 'Gulbring', theme: 'blue' },
    { id: '3', user: 'Kultur Kaia', text: 'Vi trenger folk til å jobbe Plumbo, vaktsjefene lover å ha utvida!!', location: 'Grivi', theme: 'green' },
    { id: '4', user: 'Adrian Ro', text: 'Æ E Fyllesjuk!!', location: '', theme: 'orange' },
    { id: '5', user: 'Emma Nilsen', text: 'Noen som vil spille volleyball i hallen?', location: 'Sportshallen', theme: 'yellow' },
    { id: '6', user: 'Jonas Berg', text: 'Quiz-kveld på Kafe Gul! Hvem blir med?', location: 'Kafe Gul', theme: 'purple' },
    { id: '7', user: 'Sofie Hansen', text: 'Gratis pizza til de første 10 på møte!', location: 'Studenthuset', theme: 'pink' },
    { id: '8', user: 'Mathias Lund', text: 'Noen som vil ha gruppeøving i matte?', location: 'Biblioteket', theme: 'cyan' },
];

export default function HomeScreen() {
    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
    const [menuVisible, setMenuVisible] = useState(false);
    // @ts-ignore
    const {location, errorMsg} = LocationComp();
    const router = useRouter();


    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    // 🎨 Dynamiske stiler basert på Dark/Light Mode
    const themeStyles = useMemo(() => ({
        menuBackground: isDarkMode ? '#333' : 'white',
        textColor: isDarkMode ? 'white' : '#000',
        borderColor: isDarkMode ? '#555' : '#ccc',
    }), [isDarkMode]);

    console.log(location !== null ? location: "hæææ");

    return (
        <SafeAreaView style={[styles.safeContainer, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>




            {/* Navbar */}
            <View style={styles.navbar}>
                <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={24} color="white" />
                    <Text style={styles.locationText}>Campus Bø</Text>
                </View>

                <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                    <Ionicons name="ellipsis-vertical" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* MODAL FOR MENU */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={menuVisible}
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity style={styles.modalBackground} onPress={toggleMenu}>
                    <View style={[styles.menuContainer, { backgroundColor: themeStyles.menuBackground }]}>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/profile'); }} style={styles.menuItem}>
                            <Text style={[styles.menuText, { color: themeStyles.textColor }]}>Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/clubs'); }} style={styles.menuItem}>
                            <Text style={[styles.menuText, { color: themeStyles.textColor }]}>Clubs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/settings'); }} style={styles.menuItem}>
                            <Text style={[styles.menuText, { color: themeStyles.textColor }]}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleTheme} style={styles.menuItem}>
                            <Text style={[styles.menuText, { color: themeStyles.textColor }]}>Dark / Light Mode</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/terms-of-service'); }} style={styles.menuItem}>
                            <Text style={[styles.menuText, { color: themeStyles.textColor }]}>Terms of Service</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/logout'); }} style={[styles.menuItem, styles.logout, { borderColor: themeStyles.borderColor }]}>
                            <Text style={[styles.menuText, { color: themeStyles.textColor }]}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* FlatList for Posts */}
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Post post={item} />}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            />
            <View style={styles.container}>

                <Text style={styles.paragraph}>{
                    // @ts-ignore
                    location !== null ? location.toString(): errorMsg
                }</Text>
            </View>

            {/* BottomMenu */}
            <BottomMenu />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: '#222',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 5,
    },
    menuButton: {
        padding: 5,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    menuContainer: {
        width: 250,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    menuItem: {
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
    },
    logout: {
        borderTopWidth: 1,
        marginTop: 5,
    },
    list: {
        paddingBottom: 80, // 🔹 Viktig! Plass til BottomMenu så siste innlegg ikke skjules
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
        color: 'red',
    },
});
