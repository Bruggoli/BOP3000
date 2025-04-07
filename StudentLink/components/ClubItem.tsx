import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ClubItem({ club }: { club: any }) {
    const [expanded, setExpanded] = useState(false);
    const [isMember, setIsMember] = useState(false); // For testing

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const handleFollowClub = async () => {
        try {
            const brukerId = await AsyncStorage.getItem("userId");
            if (!brukerId || brukerId.length !== 24) {
                Alert.alert("Feil", "Ugyldig eller manglende bruker-ID");
                return;
            }
            console.log("🔍 Forsøker å følge klubb", club._id, "med bruker", brukerId);
            const response = await fetch("http://10.0.2.2:3000/klubb/folg", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ brukerId, klubbId: club._id }),
            });
            const responseText = await response.text(); // ⬅️ legg til denne
            console.log("📩 Backend svarte:", response.status, responseText);


            if (!response.ok) throw new Error(await response.text());
            setIsMember(true);
            Alert.alert("Suksess", `Du følger nå ${club.navn}`);
        } catch (error) {
            Alert.alert("Feil", "Kunne ikke følge klubben");
        }
    };


    const handleUnfollowClub = async () => {
        try {
            const brukerId = await AsyncStorage.getItem("userId");
            if (!brukerId) {
                Alert.alert("Feil", "Fant ikke bruker-ID");
                return;
            }

            const response = await fetch("http://10.0.2.2:3000/klubb/sluttfolg", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ brukerId, klubbId: club._id }),
            });

            const text = await response.text();
            console.log("🛑 Unfollow-respons:", response.status, text);

            if (!response.ok) throw new Error(text);

            setIsMember(false);
            Alert.alert("Suksess", `Du har sluttet å følge ${club.navn}`);
        } catch (error) {
            Alert.alert("Feil", "Kunne ikke slutte å følge klubben");
        }
    };

    useEffect(() => {
        const checkMembership = async () => {
            const brukerId = await AsyncStorage.getItem("userId");
            if (!brukerId || !club?.følgere) return;

            const følger = club.følgere.some((id: string) => id === brukerId);
            setIsMember(følger);
        };

        checkMembership();
    }, [club]);


    return (
        <TouchableOpacity style={styles.clubContainer} onPress={toggleExpand}>
            <Text style={styles.clubName}>{club.navn}</Text>

            {expanded && (
                <View style={styles.clubDetails}>
                    <Text style={styles.clubDesc}>{club.beskrivelse}</Text>
                    <Text style={styles.clubAdmin}>Admin: {club.admin}</Text>

                    {isMember ? (
                        <TouchableOpacity style={styles.leaveButton} onPress={handleUnfollowClub}>
                            <Text style={styles.buttonText}>Slutt å følge</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.joinButton} onPress={handleFollowClub}>
                            <Text style={styles.buttonText}>Følg klubb</Text>
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
