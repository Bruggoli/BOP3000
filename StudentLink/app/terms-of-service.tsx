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
                <Text style={styles.title}>Brukervilkår for StudentLink</Text>

                <Text style={styles.text}>
                    1. Godkjenning av vilkår. {"\n"}
                    Ved å bruke StudentLink, godtar du disse vilkårene. Hvis du ikke er enig, kan du ikke bruke appen.
                </Text>

                <Text style={styles.text}>
                    2. Registrering av bruker.{"\n"}
                    For å opprette en bruker må du ha en gyldig @usn.no-e-postadresse eller annen universitets-e-post.{"\n"}
                    Du er selv ansvarlig for å holde innloggingsdetaljene dine trygge.{"\n"}
                </Text>

                <Text style={styles.text}>
                    3. Hvem kan bruke appen?{"\n"}
                    Appen er beregnet på studenter. For å bruke den må du enten:{"\n"}
                    Være minst 18 år, eller{"\n"}
                    Være registrert som student ved et universitet.{"\n"}
                </Text>

                <Text style={styles.text}>
                    4. Ditt innhold i appen.{"\n"}
                    Du eier det du laster opp, men gir StudentLink tillatelse til å vise det.{"\n"}
                    Alt du publiserer (som innlegg eller kommentarer) må følge appens regler – du er ansvarlig for innholdet ditt.{"\n"}
                </Text>

                <Text style={styles.text}>
                    5. Hva er ikke tillatt?{"\n"}
                    Du må ikke:{"\n"}
                    Dele støtende, truende, diskriminerende eller ulovlig innhold.{"\n"}
                    Misbruke rapporteringsfunksjonen eller late som om du er noen andre.{"\n"}
                    Forsøke å skade, hacke eller forstyrre appens funksjoner.
                </Text>

                <Text style={styles.text}>
                    6. Avslutte din brukerkonto.{"\n"}
                    Du kan når som helst slette kontoen din. Ved sletting kan du velge om du også vil fjerne alle dine innlegg og kommentarer.{"\n"}
                    StudentLink forbeholder seg retten til å stanse eller fjerne kontoer som bryter vilkårene.{"\n"}
                </Text>

                <Text style={styles.text}>
                    7. Personvern og data.{"\n"}
                    Vi lagrer kun nødvendig informasjon for at appen skal fungere. Les mer i vår personvernerklæring (lenke følger senere).
                </Text>

                <Text style={styles.text}>
                    8. Ansvar og garantier.{"\n"}
                    Appen leveres «som den er» – uten garantier. Vi er ikke ansvarlige for eventuelle problemer eller skader som oppstår ved bruk.
                </Text>

                <Text style={styles.text}>
                    9. Endringer i vilkårene.{"\n"}
                    Disse vilkårene kan oppdateres. Eventuelle endringer gjelder fra publiseringsdatoen i appen.
                </Text>

                <Text style={styles.text}>
                    10. Kontakt oss.{"\n"}
                    Har du spørsmål? .{"\n"}
                    Ta kontakt på: studentlink@gmail.com.
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
