import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { createCommande } from '../../../../store/redux/commandesSlice';
import { useEffect } from 'react'; 

export default function ModalAjouterCommande({ visible, onClose,produitPreselectionne }) {
    
    const [nature, setNature] = useState('place');
    const [numeroTable, setNumeroTable] = useState('');
    const [produitTemp, setProduitTemp] = useState(null);
    const [isFocusProduit, setIsFocusProduit] = useState(false);
    const [plats, setPlats] = useState([]);
    const [loading, setLoading] = useState(false);

    const [dateCommande, setDateCommande] = useState(new Date());
    const [heureCommande, setHeureCommande] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const dispatch = useDispatch();
    const produits = useSelector((state) => state.produits.list || []);

    const produitsDisponibles = produits.filter((p) => p.disponible);

    // Calcule le montant total de la commande à partir des plats sélectionnés
    const calculerTotal = () => {
        return plats.reduce((total, plat) => {
            const produit = produits.find((p) => p.id === plat.produitId);
            const prixUnitaire = produit ? produit.price : 0;
            return total + prixUnitaire * plat.nbre;
        }, 0);
    };

    const montantTotal = calculerTotal();

    useEffect(() => {
    if (!visible) return;

    if (produitPreselectionne) {
        setPlats([
            {
                produitId: produitPreselectionne.id,
                label: produitPreselectionne.title,
                nbre: 1,
            },
        ]);
    } else {
        setPlats([]);
    }
    }, [visible, produitPreselectionne]);

    const resetForm = () => {
        setNature('place');
        setNumeroTable('');
        setProduitTemp(null);
        setDateCommande(new Date());
        setHeureCommande(new Date());
        setShowDatePicker(false);
        setShowTimePicker(false);
        setErrorMessage('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleChangeNumeroTable = (value) => {
        const filtered = value.replace(/[^0-9]/g, '');
        setNumeroTable(filtered);
    };

    const handleAddPlat = (item) => {
        const dejaAjoute = plats.some((p) => p.produitId === item.id);
        if (dejaAjoute) {
            setIsFocusProduit(false);
            return;
        }
        setPlats([...plats, { produitId: item.id, label: item.title, nbre: 1 }]);
        setProduitTemp(null);
        setIsFocusProduit(false);
    };

    const handleRemovePlat = (produitId) => {
        setPlats(plats.filter((p) => p.produitId !== produitId));
    };

    const handleIncrement = (produitId) => {
        setPlats(
            plats.map((p) =>
                p.produitId === produitId ? { ...p, nbre: p.nbre + 1 } : p
            )
        );
    };

    const handleDecrement = (produitId) => {
        setPlats(
            plats.map((p) =>
                p.produitId === produitId && p.nbre > 1
                    ? { ...p, nbre: p.nbre - 1 }
                    : p
            )
        );
    };

    const handleDateConfirm = (date) => {
        if (date) setDateCommande(date);
        setShowDatePicker(false);
    };

    const handleTimeConfirm = (time) => {
        if (time) setHeureCommande(time);
        setShowTimePicker(false);
    };

    const isPastDateTime = (date, time) => {
        const selected = new Date(date);
        const hours = time.getHours();
        const minutes = time.getMinutes();
        selected.setHours(hours, minutes, 0, 0);
        return selected < new Date();
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('fr-FR');
    };

    const formatTime = (time) => {
        return time.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleSubmit = async () => {
        setErrorMessage('');

        if (nature === 'place' && !numeroTable) {
            setErrorMessage('Merci de préciser le numéro de table.');
            return;
        }

        if (plats.length === 0) {
            setErrorMessage("Ajoute au moins un plat à la commande.");
            return;
        }

        if (isPastDateTime(dateCommande, heureCommande)) {
            setErrorMessage("Tu ne peux pas choisir une date ou une heure déjà passée.");
            return;
        }

        setLoading(true);

        try {
            const commandeData = {
                numeroTable: nature === 'place' ? Number(numeroTable) : null,
                nature,
                status: 'attente',
                dateCommande: dateCommande.toISOString().split('T')[0],
                heureCommande: heureCommande.toTimeString().slice(0, 5),
                plats,
                total: Number(montantTotal.toFixed(2)),   // 🔧 ajouté

            };

            await dispatch(createCommande(commandeData)).unwrap();
            handleClose();
            Alert.alert('Commande enregistrée avec succès !');
        } catch (error) {
            setErrorMessage("Impossible d'enregistrer la commande. Réessaie.");
            console.error('Erreur enregistrement commande :', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Nouvelle commande</Text>
                            <TouchableOpacity onPress={handleClose}>
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Type de commande</Text>
                        <View style={styles.natureRow}>
                            <TouchableOpacity
                                style={[styles.natureButton, nature === 'place' && styles.natureButtonActive]}
                                onPress={() => setNature('place')}
                            >
                                <Text style={[styles.natureText, nature === 'place' && styles.natureTextActive]}>
                                    Sur place
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.natureButton, nature === 'export' && styles.natureButtonActive]}
                                onPress={() => setNature('export')}
                            >
                                <Text style={[styles.natureText, nature === 'export' && styles.natureTextActive]}>
                                    À emporter
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {nature === 'place' && (
                            <>
                                <Text style={styles.label}>Numéro de table</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ex : 5"
                                    placeholderTextColor="#aeaeae"
                                    value={numeroTable}
                                    onChangeText={handleChangeNumeroTable}
                                    keyboardType="number-pad"
                                />
                            </>
                        )}

                        <View style={styles.container}>
                            <Text style={styles.label}>Choix des plats</Text>
                            <Dropdown
                                style={[styles.dropdown, isFocusProduit && styles.dropdownFocused]}
                                containerStyle={styles.dropdownContainer}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                activeColor="#FFF5E5"
                                iconStyle={styles.iconStyle}
                                data={produitsDisponibles}
                                labelField="title"
                                valueField="id"
                                placeholder={!isFocusProduit ? 'Ajouter un plat' : '...'}
                                value={produitTemp}
                                onFocus={() => setIsFocusProduit(true)}
                                onBlur={() => setIsFocusProduit(false)}
                                onChange={handleAddPlat}
                                renderItem={(item) => (
                                    <View style={styles.item} key={item.id}>
                                        <Text style={styles.itemText}>{item.title}</Text>
                                    </View>
                                )}
                            />

                            {plats.length === 0 ? (
                                <Text style={styles.emptyText}>Aucun plat ajouté pour l'instant</Text>
                            ) : (
                                <View style={styles.platsList}>
                                    {plats.map((item) => (
                                        <View key={item.produitId} style={styles.platRow}>
                                            <Text style={styles.platName}>{item.label}</Text>

                                            <View style={styles.stepper}>
                                                <TouchableOpacity style={styles.stepperButton} onPress={() => handleDecrement(item.produitId)}>
                                                    <Text style={styles.stepperText}>–</Text>
                                                </TouchableOpacity>
                                                <Text style={styles.stepperValue}>{item.nbre}</Text>
                                                <TouchableOpacity style={styles.stepperButton} onPress={() => handleIncrement(item.produitId)}>
                                                    <Text style={styles.stepperText}>+</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemovePlat(item.produitId)}>
                                                <Text style={styles.removeButtonText}>✕</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* 🔧 Nouveau bloc : total de la commande */}
                            {plats.length > 0 && (
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>Total de la commande</Text>
                                    <Text style={styles.totalValue}>{montantTotal.toFixed(2)} GNF</Text>
                                </View>
                            )}
                        </View>

                        <Text style={styles.label}>Date de commande</Text>
                        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                            <Text>{formatDate(dateCommande)}</Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>Heure de commande</Text>
                        <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                            <Text>{formatTime(heureCommande)}</Text>
                        </TouchableOpacity>

                        {errorMessage ? (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{errorMessage}</Text>
                            </View>
                        ) : null}

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                                <Text style={styles.cancelText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.addButton} onPress={handleSubmit} disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.addText}>Créer la commande</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>

            <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                minimumDate={new Date()}
                onConfirm={handleDateConfirm}
                onCancel={() => setShowDatePicker(false)}
                isDarkModeEnabled={false}
                themeVariant="light"
            />

            <DateTimePickerModal
                isVisible={showTimePicker}
                mode="time"
                onConfirm={handleTimeConfirm}
                onCancel={() => setShowTimePicker(false)}
                style={{color:"#000"}}
                isDarkModeEnabled={false}
                 themeVariant="light"
            />
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, maxHeight: '85%' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#070707' },
    closeIcon: { fontSize: 22, color: '#070707' },
    label: { fontSize: 15, fontWeight: '600', color: '#070707', marginBottom: 10 },

    natureRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    natureButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 30,
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    natureButtonActive: {
        backgroundColor: '#F5A623',
        borderColor: '#F5A623',
    },
    natureText: { fontSize: 15, fontWeight: '600', color: '#070707' },
    natureTextActive: { color: '#fff' },

    input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 30, paddingVertical: 14, paddingHorizontal: 20, fontSize: 15, color: '#070707', marginBottom: 20 },

    container: { marginBottom: 20 },
    dropdown: { height: 52, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 30, paddingHorizontal: 20, backgroundColor: '#fff' },
    dropdownFocused: { borderColor: '#F5A623' },
    dropdownContainer: { backgroundColor: '#fff', borderRadius: 16, marginTop: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 5 },
    placeholderStyle: { fontSize: 15, color: '#aeaeae' },
    selectedTextStyle: { fontSize: 15, color: '#070707' },
    iconStyle: { tintColor: '#aeaeae' },
    item: { paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#fff' },
    itemText: { fontSize: 15, color: '#070707', fontWeight: '400' },

    emptyText: { fontSize: 13, color: '#aeaeae', marginTop: 10, fontStyle: 'italic' },
    platsList: { marginTop: 12, gap: 10 },
    platRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 16,
        gap: 10,
    },
    platName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#070707' },

    stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    stepperButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepperText: { fontSize: 16, fontWeight: '700', color: '#070707' },
    stepperValue: { fontSize: 14, fontWeight: '600', color: '#070707', minWidth: 20, textAlign: 'center' },

    removeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: { fontSize: 14, color: '#EF4444', fontWeight: '700' },

    buttonRow: { flexDirection: 'row', gap: 12, marginTop: 10, marginBottom: 10 },
    cancelButton: { flex: 1, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 30, paddingVertical: 16, justifyContent: 'center', alignItems: 'center' },
    cancelText: { fontSize: 16, fontWeight: 'bold', color: '#070707' },
    addButton: { flex: 1, backgroundColor: '#F5A623', borderRadius: 30, paddingVertical: 16, justifyContent: 'center', alignItems: 'center' },
    addText: { fontSize: 16, fontWeight: '600', color: '#fff' },
    errorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
},
errorText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: '600',
},
totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF5E5',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 6,
},
totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#070707',
},
totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F5A623',
},
});