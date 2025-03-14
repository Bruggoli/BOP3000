import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function ClubItem({ club }: { club: any }) {
    const [expanded, setExpanded] = useState(false);
    const [isMember, setIsMember] = useState(false); // For testing

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const handleJoinClub = async () => {
        // Her skal API-kall gjøres senere
        // await axios.post(`https://your-api-url.com/clubs/${club._id}/join`);
        setIsMember(true);
        Alert.alert('Suksess', `Du har sendt en forespørsel om å bli med i ${club.navn}.`);
    };

    const handleLeaveClub = async () => {
        // Her skal API-kall gjøres senere
        // await axios.post(`https://your-api-url.com/clubs/${club._id}/leave`);
        setIsMember(false);
        Alert.alert('Suksess', `Du har forlatt ${club.navn}.`);
    };

    return (
        <TouchableOpacity style={styles.clubContainer} onPress={toggleExpand}>
            <Text style={styles.clubName}>{club.navn}</Text>

            {expanded && (
                <View style={styles.clubDetails}>
                    <Text style={styles.clubDesc}>{club.beskrivelse}</Text>
                    <Text style={styles.clubAdmin}>Admin: {club.admin}</Text>

                    {isMember ? (
                        <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveClub}>
                            <Text style={styles.buttonText}>Forlat klubben</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.joinButton} onPress={handleJoinClub}>
                            <Text style={styles.buttonText}>Send Join Request</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    clubContainer: {
        backgroundColor: '#222',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    clubName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    clubDetails: {
        marginTop: 10,
    },
    clubDesc: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 5,
    },
    clubAdmin: {
        fontSize: 12,
        color: '#777',
        marginBottom: 10,
    },
    joinButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 5,
    },
    leaveButton: {
        backgroundColor: '#D32F2F',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
