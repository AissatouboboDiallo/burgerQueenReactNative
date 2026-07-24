// Components/parametres/ModalConfirmSuppression.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, Alert } from 'react-native';

export default function ModalConfirmMotPass({ visible, onClose, onConfirm ,text}) {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!password) {
            Alert.alert('Mot de passe requis', 'Merci de saisir ton mot de passe pour confirmer.');
            return;
        }
        setLoading(true);
        try {
            await onConfirm(password);
        } finally {
            setLoading(false);
            setPassword('');
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.box}>
                    
                    <Text style={styles.title}> {text ==="suppression" && "Confirmer la suppression"} {text ==="modificationMotPass" && "Modification du mot de pass"} {text ==="modificationInfoUser" && "Modification du profil"}  </Text>
                    <Text style={styles.subtitle}>
                       {text ==="suppression" && "Cette action est irréversible. "} Saisis ton mot de passe pour confirmer.
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        placeholderTextColor="#aeaeae"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.deleteButton , text ==="suppression" && {backgroundColor:"#EF4444"}]} onPress={handleConfirm} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.deleteText]}  >Continuer</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    box: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '85%' },
    title: { fontSize: 18, fontWeight: 'bold', color: '#070707', marginBottom: 8 },
    subtitle: { fontSize: 13, color: '#6B7280', marginBottom: 16 },
    input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 16, padding: 14, fontSize: 15, marginBottom: 20 },
    buttonRow: { flexDirection: 'row', gap: 12 },
    cancelButton: { flex: 1, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
    cancelText: { fontWeight: 'bold', color: '#070707' },
    deleteButton: { flex: 1, backgroundColor: '#F5A623', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
    deleteText: { fontWeight: 'bold', color: '#fff' },
});