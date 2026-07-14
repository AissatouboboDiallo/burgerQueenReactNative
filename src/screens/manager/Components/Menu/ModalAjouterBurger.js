import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { setCategoriesRealtime } from '../../../../store/redux/categoriesSlice';
import { subscribeTocategories } from '../../../../services/categoriesServices'
import { subscribeToIngredients } from '../../../../services/igredientsServices';
import { setIngredientsRealtime } from '../../../../store/redux/ingredientsSlice';
import { createProduit, editProduit } from '../../../../store/redux/produitsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';

const EMOJIS = ['🍔', '🥓', '🧀', '🥑', '🌶️', '🍟', '🥪', '🌭'];

// Calcule si le produit est disponible selon le stock actuel des ingrédients de sa recette
const calculerDisponibilite = (recetteFormatee, ingredientsList) => {
    return recetteFormatee.every((item) => {
        const ingredient = ingredientsList.find((ing) => ing.id === item.ingredientId);
        if (!ingredient) return false; // ingrédient introuvable = pas disponible par sécurité
        return ingredient.quantiteActuelle >= item.quantiteUtilisee;
    });
};

export default function ModalAjouterBurger({ visible, onClose, burger }) {

    const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [prix, setPrix] = useState('');
    const [categorie, setCategorie] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [isFocusIng, setIsFocusIng] = useState(false);
    const [recette, setRecette] = useState([]);
    const [ingredientTemp, setIngredientTemp] = useState(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.list);
    const ingredientsList = useSelector((state) => state.ingredients.list);

    const ingredientsListFilter = categorie
        ? ingredientsList.filter((ing) =>
            Array.isArray(ing.categorieCompatible) && ing.categorieCompatible.includes(categorie)
          )
        : [];

    // Détermine si on est en mode édition (burger fourni avec un id) ou ajout
    const isEditMode = !!(burger && burger.id);


    // Synchronise le formulaire à chaque ouverture de la modal
    useEffect(() => {
        if (!visible) return;

        if (isEditMode) {
            setSelectedEmoji(burger.img);
            setNom(burger.title);
            setDescription(burger.desc.join(', '));
            setPrix(burger.price.toString());
            setCategorie(burger.categoryId);
            setRecette(
                (burger.recette || []).map((r) => {
                    const ing = ingredientsList.find((i) => i.id === r.ingredientId);
                    return {
                        ingredientId: r.ingredientId,
                        nom: ing ? ing.nom : '',
                        unite: ing ? ing.unite : '',
                        quantiteUtilisee: r.quantiteUtilisee.toString(),
                    };
                })
            );
        } else {
            resetForm();
        }
    }, [burger, visible]);

    useEffect(() => {
        const unsubscribe = subscribeTocategories((categorieData) => {
            dispatch(setCategoriesRealtime(categorieData));
        });
        const unsubscribeIng = subscribeToIngredients((ingredientData) => {
            dispatch(setIngredientsRealtime(ingredientData));
        });

        return () => {
            unsubscribe();
            unsubscribeIng();
        };
    }, []);

    const renderItem = (item) => (
        <View style={styles.item} key={item.id}>
            <Text style={styles.itemText}>{item.nom}</Text>
        </View>
    );

    const resetForm = () => {
        setSelectedEmoji(EMOJIS[0]);
        setNom('');
        setDescription('');
        setPrix('');
        setCategorie(null);
        setRecette([]);
        setIngredientTemp(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleAddIngredient = (item) => {
        const dejaAjoute = recette.some((r) => r.ingredientId === item.id);
        if (dejaAjoute) {
            setIsFocusIng(false);
            return;
        }
        setRecette([
            ...recette,
            { ingredientId: item.id, nom: item.nom, unite: item.unite, quantiteUtilisee: '' },
        ]);
        setIngredientTemp(null);
        setIsFocusIng(false);
    };

    const handleRemoveIngredient = (ingredientId) => {
        setRecette(recette.filter((r) => r.ingredientId !== ingredientId));
    };

    // Empêche la saisie de chiffres dans la description
    const handleChangeDescription = (value) => {
        const filtered = value.replace(/[0-9]/g, '');
        setDescription(filtered);
    };

// N'autorise que les chiffres, un point OU une virgule (pour les décimales) dans le prix
    const handleChangePrix = (value) => {
        let filtered = value.replace(/[^0-9.,]/g, '');
        
        // Empêche d'avoir 2 séparateurs décimaux (ex: "9.9.9" ou "9,9,9")
        const separatorCount = (filtered.match(/[.,]/g) || []).length;
        if (separatorCount > 1) {
            filtered = filtered.slice(0, -1); // annule le dernier caractère tapé en trop
        }
        
        setPrix(filtered);
    };

    const handleChangeQuantite = (ingredientId, value) => {
        setRecette(
            recette.map((r) => (r.ingredientId === ingredientId ? { ...r, quantiteUtilisee: value } : r))
        );
    };

    const handleSubmit = async () => {
        // Validation AVANT d'activer le loading
        if (!nom || !prix || recette.length === 0 || !categorie) {
            Alert.alert('Champs manquants', "Merci de remplir tous les champs et d'ajouter au moins un ingrédient.");
            return;
        }

        setLoading(true);

        try {
            const recetteFormatee = recette.map((r) => ({
                ingredientId: r.ingredientId,
                quantiteUtilisee: Number(parseFloat(r.quantiteUtilisee).toFixed(3)),
            }));

            const disponible = calculerDisponibilite(recetteFormatee, ingredientsList);
            console.log("disponibilité : ", disponible);
            
            const produitData = {
                img: selectedEmoji,
                title: nom,
                desc: description.split(',').map((d) => d.trim()),
                price: Number(parseFloat(prix).toFixed(2)),
                categoryId: categorie,
                recette: recetteFormatee,
                disponible: disponible,
            };

            if (isEditMode) {
                await dispatch(editProduit({ id: burger.id, updates: produitData })).unwrap();
            } else {
                await dispatch(createProduit(produitData)).unwrap();
            }

            handleClose();
        } catch (error) {
            Alert.alert('Erreur', "Impossible d'enregistrer le produit. Réessaie.");
            console.error('Erreur enregistrement produit :', error);
        } finally {

            
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <View style={[styles.overlay, categorie && { justifyContent: "flex-start", marginTop: 22 }]}>
                <View style={[styles.modalContainer, categorie && { flex: 1, borderRadius: 30, marginTop: 25 }]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>
                                {isEditMode ? "Modifier un burger" : "Ajouter un burger"}
                            </Text>
                            <TouchableOpacity onPress={handleClose}>
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Emoji</Text>
                        <View style={styles.emojiRow}>
                            {EMOJIS.map((emoji, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.emojiCircle, selectedEmoji === emoji && styles.emojiCircleSelected]}
                                    onPress={() => setSelectedEmoji(emoji)}
                                >
                                    <Text style={styles.emojiText}>{emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.container}>
                            <Text style={styles.label}>Choisir une Catégorie</Text>
                            <Dropdown
                                style={[styles.dropdown, isFocus && styles.dropdownFocused]}
                                containerStyle={styles.dropdownContainer}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                activeColor="#FFF5E5"
                                iconStyle={styles.iconStyle}
                                data={categories}
                                labelField="nom"
                                valueField="id"
                                placeholder={!isFocus ? 'Sélectionner une catégorie' : '...'}
                                value={categorie}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={(item) => {
                                    setCategorie(item.id);
                                    setIsFocus(false);
                                }}
                                renderItem={renderItem}
                            />
                        </View>

                        <Text style={styles.label}>Nom</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex : Queen BBQ"
                            placeholderTextColor="#aeaeae"
                            value={nom}
                            onChangeText={setNom}
                        />

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrédients principaux"
                            placeholderTextColor="#aeaeae"
                            value={description}
                            onChangeText={handleChangeDescription}

                        />

                        <View style={styles.container}>
                            <Text style={styles.label}>Choix des ingrédients</Text>
                            <Dropdown
                                style={[styles.dropdown, isFocusIng && styles.dropdownFocused]}
                                containerStyle={styles.dropdownContainer}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                activeColor="#FFF5E5"
                                iconStyle={styles.iconStyle}
                                data={ingredientsListFilter}
                                labelField="nom"
                                valueField="id"
                                placeholder={!isFocusIng ? 'Ajouter un ingrédient' : '...'}
                                value={ingredientTemp}
                                onFocus={() => setIsFocusIng(true)}
                                onBlur={() => setIsFocusIng(false)}
                                onChange={handleAddIngredient}
                                renderItem={renderItem}
                            />

                            {recette.length === 0 ? (
                                <Text style={styles.emptyText}>Aucun ingrédient ajouté pour l'instant</Text>
                            ) : (
                                <View style={styles.recetteList}>
                                    {recette.map((item) => (
                                        <View key={item.ingredientId} style={styles.ingredientRow}>
                                            <View style={styles.ingredientInfo}>
                                                <Text style={styles.ingredientName}>{item.nom}</Text>
                                                <Text style={styles.ingredientUnit}>{item.unite}</Text>
                                            </View>
                                            <TextInput
                                                style={styles.quantiteInput}
                                                placeholder="Qté"
                                                placeholderTextColor="#aeaeae"
                                                value={item.quantiteUtilisee}
                                                onChangeText={(value) => handleChangeQuantite(item.ingredientId, value)}
                                                keyboardType="decimal-pad"
                                            />
                                            <TouchableOpacity
                                                style={styles.removeButton}
                                                onPress={() => handleRemoveIngredient(item.ingredientId)}
                                            >
                                                <Text style={styles.removeButtonText}>✕</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                        <Text style={styles.label}>Prix (GNF)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="9,90"
                            placeholderTextColor="#aeaeae"
                            value={prix}
                            onChangeText={handleChangePrix}
                            keyboardType="decimal-pad"
                        />

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
    emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    emojiCircle: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
    emojiCircleSelected: { borderColor: '#F5A623', borderWidth: 2, backgroundColor: '#FFF5E5' },
    emojiText: { fontSize: 26 },
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
    recetteList: { marginTop: 12, gap: 10 },
    ingredientRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16, gap: 10 },
    ingredientInfo: { flex: 1 },
    ingredientName: { fontSize: 14, fontWeight: '600', color: '#070707' },
    ingredientUnit: { fontSize: 12, color: '#aeaeae', marginTop: 2 },
    quantiteInput: { width: 70, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 12, fontSize: 14, color: '#070707', backgroundColor: '#fff', textAlign: 'center' },
    removeButton: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FEF2F2', justifyContent: 'center', alignItems: 'center' },
    removeButtonText: { fontSize: 14, color: '#EF4444', fontWeight: '700' },
});