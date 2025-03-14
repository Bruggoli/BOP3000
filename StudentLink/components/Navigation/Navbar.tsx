import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Navbar({ location, toggleTheme }: { location: string, toggleTheme: () => void }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const router = useRouter();

    const toggleMenu = () => setMenuVisible(!menuVisible);

    return (
        <View style={styles.navbarContainer}>
            <StatusBar barStyle="light-content" />
            <View style={styles.navbar}>
                <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={24} color="white" />
                    <Text style={styles.locationText}>{location}</Text>
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
                onRequestClose={toggleMenu}
            >
                <TouchableOpacity style={styles.modalBackground} onPress={toggleMenu}>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/profile'); }} style={styles.menuItem}>
                            <Ionicons name="person-outline" size={20} color="black" />
                            <Text style={styles.menuText}>Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/clubs'); }} style={styles.menuItem}>
                            <Ionicons name="people-outline" size={20} color="black" />
                            <Text style={styles.menuText}>Clubs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/settings'); }} style={styles.menuItem}>
                            <Ionicons name="settings-outline" size={20} color="black" />
                            <Text style={styles.menuText}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleTheme} style={styles.menuItem}>
                            <Ionicons name="contrast-outline" size={20} color="black" />
                            <Text style={styles.menuText}>Dark / Light Mode</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/terms-of-service'); }} style={styles.menuItem}>
                            <Ionicons name="document-text-outline" size={20} color="black" />
                            <Text style={styles.menuText}>Terms of Service</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { toggleMenu(); router.push('/logout'); }} style={[styles.menuItem, styles.logout]}>
                            <Ionicons name="log-out-outline" size={20} color="red" />
                            <Text style={[styles.menuText, styles.logoutText]}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    navbarContainer: {
        width: '100%', // Dekker hele skjermen
        backgroundColor: '#222',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        width: '100%', // Sikrer at den dekker hele bredden
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
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        elevation: 5, // Skyggeeffekt for Android
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        width: '100%',
        justifyContent: 'center',
        gap: 8,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
    },
    logout: {
        borderTopWidth: 1,
        borderColor: '#ccc',
        marginTop: 5,
        paddingTop: 10,
    },
    logoutText: {
        color: 'red',
        fontWeight: 'bold',
    },
});
