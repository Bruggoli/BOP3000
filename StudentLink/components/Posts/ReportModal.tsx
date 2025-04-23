import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

const reportReasons = [
    "Upassende innhold",
    "Spam",
    "Trakassering",
    "Annet",
];

export default function ReportModal({ visible, onClose, onSubmit }: {
    visible: boolean,
    onClose: () => void,
    onSubmit: (reason: string) => void
}) {
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [customReason, setCustomReason] = useState<string>('');

    const handleSend = () => {
        if (selectedReason === 'Annet') {
            if (!customReason.trim()) return;
            onSubmit(customReason.trim());
        } else {
            onSubmit(selectedReason);
        }
        setSelectedReason('');
        setCustomReason('');
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.header}>Rapporter innlegg</Text>
                    {reportReasons.map((reason) => (
                        <TouchableOpacity
                            key={reason}
                            style={[styles.option, selectedReason === reason && styles.selectedOption]}
                            onPress={() => setSelectedReason(reason)}
                        >
                            <Text style={styles.optionText}>{reason}</Text>
                        </TouchableOpacity>
                    ))}

                    {selectedReason === 'Annet' && (
                        <TextInput
                            placeholder="Beskriv årsaken..."
                            placeholderTextColor="#ccc"
                            style={styles.input}
                            value={customReason}
                            onChangeText={setCustomReason}
                        />
                    )}

                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Avbryt</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSend}
                            style={[styles.sendButton, !selectedReason && styles.disabledButton]}
                            disabled={!selectedReason || (selectedReason === 'Annet' && !customReason.trim())}
                        >
                            <Text style={styles.buttonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalBox: {
        backgroundColor: '#222',
        padding: 20,
        borderRadius: 12,
        width: '90%',
    },
    header: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    option: {
        padding: 12,
        backgroundColor: '#333',
        borderRadius: 8,
        marginVertical: 4,
    },
    selectedOption: {
        backgroundColor: '#555',
    },
    optionText: {
        color: 'white',
        fontSize: 16,
    },
    input: {
        backgroundColor: '#444',
        color: 'white',
        padding: 10,
        borderRadius: 8,
        marginTop: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#777',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    sendButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#333',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
