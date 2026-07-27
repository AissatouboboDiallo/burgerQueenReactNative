import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { setCategoriesRealtime } from '../../../../store/redux/categoriesSlice';
import { subscribeTocategories } from '../../../../services/categoriesServices';
import { createIngredient, editIngredient } from '../../../../store/redux/ingredientsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';

const UNITES = [
    { id: 'kg', nom: 'Kilogramme (kg)' },
    { id: 'L', nom: 'Litre (L)' },
    { id: 'unites', nom: 'Unité(s)' },
];

export default function ModalAjoutIngredient({ visible, onClose, ingredient }) {

    const [nom, setNom] = useState('');
    const [unite, setUnite] = useState(null);
    const [quantiteActuelle, setQuantiteActuelle] = useState('');
    const [quantiteMax, setQuantiteMax] = useState('');
    const [seuilAlerte, setSeuilAlerte] = useState('');
    const [categoriesCompatibles, setCategoriesCompatibles] = useState([]); // [{id, nom}]
    const [categorieTemp, setCategorieTemp] = useState(null);

    const [isFocusUnite, setIsFocusUnite] = useState(false);
    const [isFocusCat, setIsFocusCat] = useState(false);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const categoriesList = useSelector((state) => state.categories.list);

    // Catégories pas encore ajoutées, pour ne pas les proposer deux fois dans le dropdown
    const categoriesDisponibles = categoriesList.filter(
        (cat) => !categoriesCompatibles.some((c) => c.id === cat.id)
    );

    const isEditMode = !!(ingredient && ingredient.id);

    // Synchronise le formulaire à chaque ouverture de la modal
    useEffect(() => {
        if (!visible) return;

        if (isEditMode) {
            setNom(ingredient.nom);
            setUnite(ingredient.unite);
            setQuantiteActuelle(ingredient.quantiteActuelle.toString());
            setQuantiteMax(ingredient.quantiteMax.toString());
            setSeuilAlerte(ingredient.seuilAlerte ? ingredient.seuilAlerte.toString() : '');
            setCategoriesCompatibles(
                (ingredient.categorieCompatible || []).map((catId) => {
                    const cat = categoriesList.find((c) => c.id === catId);
                    return { id: catId, nom: cat ? cat.nom : catId };
                })
            );
        } else {
            resetForm();
        }
    }, [ingredient, visible]);

    useEffect(() => {
        const unsubscribe = subscribeTocategories((categorieData) => {
            dispatch(setCategoriesRealtime(categorieData));
        });
        return () => unsubscribe();
    }, []);

    const resetForm = () => {
        setNom('');
        setUnite(null);
        setQuantiteActuelle('');
        setQuantiteMax('');
        setSeuilAlerte('');
        setCategoriesCompatibles([]);
        setCategorieTemp(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Autorise uniquement les lettres (avec accents), espaces, tirets pour le nom
    const handleChangeNom = (value) => {
        const filtered = value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '');
        setNom(filtered);
    };

    // N'autorise que les chiffres, un point OU une virgule
    const handleChangeDecimal = (setter) => (value) => {
        let filtered = value.replace(/[^0-9.,]/g, '');
        const separatorCount = (filtered.match(/[.,]/g) || []).length;
        if (separatorCount > 1) {
            filtered = filtered.slice(0, -1);
        }
        setter(filtered);
    };

    const handleAddCategorie = (item) => {
        setCategoriesCompatibles([...categoriesCompatibles, { id: item.id, nom: item.nom }]);
        setCategorieTemp(null);
        setIsFocusCat(false);
    };

    const handleRemoveCategorie = (catId) => {
        setCategoriesCompatibles(categoriesCompatibles.filter((c) => c.id !== catId));
    };

    const renderCategorieItem = (item) => (
        <View style={styles.item} key={item.id}>
            <Text style={styles.itemText}>{item.nom}</Text>
        </View>
    );

    const renderUniteItem = (item) => (
        <View style={styles.item} key={item.id}>
            <Text style={styles.itemText}>{item.nom}</Text>
        </View>
    );

    const handleSubmit = async () => {
        if (!nom || !unite || !quantiteActuelle || !quantiteMax || categoriesCompatibles.length === 0) {
            Alert.alert('Champs manquants', "Merci de remplir tous les champs et de sélectionner au moins une catégorie.");
            return;
        }

        const qActuelle = Number(parseFloat(quantiteActuelle).toFixed(3));
        const qMax = Number(parseFloat(quantiteMax).toFixed(3));

        if (qActuelle > qMax) {
            Alert.alert('Valeur incohérente', "La quantité actuelle ne peut pas dépasser la quantité maximum.");
            return;
        }

        setLoading(true);

        try {
            const ingredientData = {
                nom,
                unite,
                quantiteActuelle: qActuelle,
                quantiteMax: qMax,
                seuilAlerte: seuilAlerte ? Number(parseFloat(seuilAlerte).toFixed(3)) : 0,
                categorieCompatible: categoriesCompatibles.map((c) => c.id),
            };

            if (isEditMode) {
                await dispatch(editIngredient({ id: ingredient.id, updates: ingredientData })).unwrap();
            } else {
                await dispatch(createIngredient(ingredientData)).unwrap();
            }

            handleClose();
        } catch (error) {
            Alert.alert('Erreur', "Impossible d'enregistrer l'ingrédient. Réessaie.");
            console.error('Erreur enregistrement ingrédient :', error);
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
                            <Text style={styles.headerTitle}>
                                {isEditMode ? "Modifier un ingrédient" : "Ajouter un ingrédient"}
                            </Text>
                            <TouchableOpacity onPress={handleClose}>
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Nom</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Pommes de terre"
                            placeholderTextColor="#aeaeae"
                            value={nom}
                            onChangeText={handleChangeNom}
                        />

                        <View style={styles.container}>
                            <Text style={styles.label}>Unité de mesure</Text>
                            <Dropdown
                                style={[styles.dropdown, isFocusUnite && styles.dropdownFocused]}
                                containerStyle={styles.dropdownContainer}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                activeColor="#FFF5E5"
                                iconStyle={styles.iconStyle}
                                data={UNITES}
                                labelField="nom"
                                valueField="id"
                                placeholder={!isFocusUnite ? 'Sélectionner une unité' : '...'}
                                value={unite}
                                onFocus={() => setIsFocusUnite(true)}
                                onBlur={() => setIsFocusUnite(false)}
                                onChange={(item) => {
                                    setUnite(item.id);
                                    setIsFocusUnite(false);
                                }}
                                renderItem={renderUniteItem}
                            />
                        </View>

                        <Text style={styles.label}>Quantité actuelle</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="3.5"
                            placeholderTextColor="#aeaeae"
                            value={quantiteActuelle}
                            onChangeText={handleChangeDecimal(setQuantiteActuelle)}
                            keyboardType="decimal-pad"
                        />

                        <Text style={styles.label}>Quantité maximum</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="5"
                            placeholderTextColor="#aeaeae"
                            value={quantiteMax}
                            onChangeText={handleChangeDecimal(setQuantiteMax)}
                            keyboardType="decimal-pad"
                        />

                        <Text style={styles.label}>Seuil d'alerte (optionnel)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="1"
                            placeholderTextColor="#aeaeae"
                            value={seuilAlerte}
                            onChangeText={handleChangeDecimal(setSeuilAlerte)}
                            keyboardType="decimal-pad"
                        />

                        <View style={styles.container}>
                            <Text style={styles.label}>Catégories compatibles</Text>
                            <Dropdown
                                style={[styles.dropdown, isFocusCat && styles.dropdownFocused]}
                                containerStyle={styles.dropdownContainer}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                activeColor="#FFF5E5"
                                iconStyle={styles.iconStyle}
                                data={categoriesDisponibles}
                                labelField="nom"
                                valueField="id"
                                placeholder={!isFocusCat ? 'Ajouter une catégorie' : '...'}
                                value={categorieTemp}
                                onFocus={() => setIsFocusCat(true)}
                                onBlur={() => setIsFocusCat(false)}
                                onChange={handleAddCategorie}
                                renderItem={renderCategorieItem}
                            />

                            {categoriesCompatibles.length === 0 ? (
                                <Text style={styles.emptyText}>Aucune catégorie sélectionnée pour l'instant</Text>
                            ) : (
                                <View style={styles.tagsWrap}>
                                    {categoriesCompatibles.map((cat) => (
                                        <View key={cat.id} style={styles.tag}>
                                            <Text style={styles.tagText}>{cat.nom}</Text>
                                            <TouchableOpacity onPress={() => handleRemoveCategorie(cat.id)}>
                                                <Text style={styles.tagRemove}>✕</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                                <Text style={styles.cancelText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.addButton} onPress={handleSubmit} disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.addText}>{isEditMode ? "Modifier" : "Ajouter"}</Text>
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
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, maxHeight: '85%' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#070707' },
    closeIcon: { fontSize: 22, color: '#070707' },
    label: { fontSize: 15, fontWeight: '600', color: '#070707', marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 30, paddingVertical: 14, paddingHorizontal: 20, fontSize: 15, color: '#070707', marginBottom: 20 },
    buttonRow: { flexDirection: 'row', gap: 12, marginTop: 10, marginBottom: 10 },
    cancelButton: { flex: 1, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 30, paddingVertical: 16, justifyContent: 'center', alignItems: 'center' },
    cancelText: { fontSize: 16, fontWeight: 'bold', color: '#070707' },
    addButton: { flex: 1, backgroundColor: '#F5A623', borderRadius: 30, paddingVertical: 16, justifyContent: 'center', alignItems: 'center' },
    addText: { fontSize: 16, fontWeight: '600', color: '#fff' },
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

    tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5E5',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,
        gap: 8,
    },
    tagText: { fontSize: 13, color: '#070707', fontWeight: '600' },
    tagRemove: { fontSize: 13, color: '#EF4444', fontWeight: '700' },
});