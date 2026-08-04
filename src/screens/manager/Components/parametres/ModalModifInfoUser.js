import React from 'react'
import { Modal, Text, View, TextInput, ScrollView,StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthActions } from '../../../../store/useAuthActions';
export default function ModalModifInfoUser({visible, onClose, onModif}) {
    const user = useSelector((state) => state.auth.user)
    const [nom, setNom] = useState(user.nom)
    const [email, setEmail] = useState(user.email)
    const [loading, setLoading] = useState(false)
    
     const handleChangeNom = (value) => {
    // Autorise uniquement les lettres (avec accents), espaces, tirets et apostrophes
    const filtered = value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '');
    setNom(filtered);
    }; 
     const handleModif = async () => {
            if (!nom || !email) {
                Alert.alert('', 'Merci de saisir ton mot de passe pour confirmer.');
                return;
            }

            const nomValide = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/.test(nom.trim());
                if (!nomValide) {
                    Alert.alert('Nom invalide', 'Le nom doit contenir entre 2 et 50 lettres, sans chiffres ni caractères spéciaux.');
                    return;
                }

            setLoading(true);
            try {
                await onModif(nom,email);
            } finally {
                setLoading(false);
            }
        };

    const handleClose = () => {
        onClose();
    };

 return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <View style={[styles.overlay]}>
                <View style={[styles.modalContainer]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>
                                Modification de profil
                            </Text>
                            <TouchableOpacity onPress={handleClose}>
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.label}>Nom</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#aeaeae"
                            value={nom}
                            onChangeText={handleChangeNom}
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />                       

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                                <Text style={styles.cancelText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.addButton} onPress={handleModif} disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.addText}>Modifier </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius:30,borderTopRightRadius:30, padding: 24, maxHeight: '85%' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#070707',marginBottom:20 },
    closeIcon: { fontSize: 22, color: '#070707' },
    label: { fontSize: 15, fontWeight: '600', color: '#070707', marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 30, paddingVertical: 14, paddingHorizontal: 20, fontSize: 15, color: '#070707', marginBottom: 20 },
    buttonRow: { flexDirection: 'row', gap: 12, marginTop: 10, marginBottom: 10 },
    cancelButton: { flex: 1, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 30, paddingVertical: 16, justifyContent: 'center', alignItems: 'center' },
    cancelText: { fontSize: 16, fontWeight: 'bold', color: '#070707' },
    addButton: { flex: 1, backgroundColor: '#F5A623', borderRadius: 30, paddingVertical: 16, justifyContent: 'center', alignItems: 'center' },
    addText: { fontSize: 16, fontWeight: '600', color: '#fff' },
    container: { marginBottom: 20 },
});
