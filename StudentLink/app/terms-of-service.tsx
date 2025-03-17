import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BottomMenu from "@/components/Navigation/BottomMenu";

export default function TermsOfService() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Vilkår for bruk</Text>

                <Text style={styles.text}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin scelerisque
                    felis ut urna feugiat, sit amet molestie metus congue. Phasellus euismod, elit eget
                    fringilla suscipit, libero tortor varius turpis, ut sagittis orci orci id neque.
                    Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
                    Integer efficitur orci in turpis sodales, nec facilisis mi condimentum.
                </Text>

                <Text style={styles.text}>
                    Nullam facilisis nunc vitae arcu ullamcorper, eget hendrerit quam dapibus. Donec
                    condimentum tristique magna, id tristique justo gravida nec. Pellentesque auctor,
                    ipsum et dapibus mattis, dui nulla facilisis orci, id pulvinar dui lacus sit amet felis.
                    Donec volutpat rhoncus mi, et lobortis dolor malesuada a. Suspendisse varius magna
                    a libero dignissim, in bibendum ligula lacinia.
                </Text>

                <Text style={styles.text}>
                    Donec vel metus nec risus vehicula cursus. Integer feugiat enim vitae lectus
                    posuere, nec tristique erat posuere. Suspendisse vehicula, nulla nec tincidunt
                    imperdiet, mauris ipsum tincidunt urna, non fringilla velit felis ac libero.
                </Text>

                <Text style={styles.text}>
                    Phasellus eget est ut elit volutpat vulputate a id felis. Donec scelerisque
                    vehicula nunc, at venenatis ex molestie id. Nam hendrerit justo vitae magna
                    luctus, non congue neque malesuada.
                </Text>

                <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Tilbake</Text>
                </TouchableOpacity>
            </ScrollView>
            <BottomMenu />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        color: 'white',
        marginBottom: 10,
        lineHeight: 24,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
