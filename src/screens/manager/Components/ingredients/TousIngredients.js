import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setIngredientsRealtime } from '../../../../store/redux/ingredientsSlice';
import { subscribeToIngredients } from '../../../../services/igredientsServices';
import ModalAjoutIngredient from './ModalAjoutIngredients';
import { Swipeable } from 'react-native-gesture-handler';
import CardIngredient from './CardIngredient';
import ingredientActions from './ingredientActions';



export default function TousIngredients({ setaffTousIngredients }) {
    const dispatch = useDispatch();
    const ingredients = useSelector((state) => state.ingredients.list);
    const {getColorProgress, getPourcentage} = ingredientActions()

    const [modalVisible, setModalVisible] = useState(false);
    const [ingredientModal, setIngredientModal] = useState(null);

    useEffect(() => {
        const unsubscribe = subscribeToIngredients((ingredientsData) => {
            dispatch(setIngredientsRealtime(ingredientsData));
        });
        return () => unsubscribe();
    }, []);

    const ingredientsEnAlerte = ingredients.filter((item) => getPourcentage(item) <= 20);

    const handleEditIngredient = (item) => {
        setIngredientModal(item);
        setModalVisible(true);
    };

    const handleAddIngredient = () => {
        setIngredientModal(null);
        setModalVisible(true);
    };
       
    return (
        <View style={styles.card}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: "column", justifyContent: "flex-start", alignContent: "flex-end", marginTop: 10, marginBottom: 25, flex: 1, gap: 20 }}>
                    <TouchableOpacity onPress={() => setaffTousIngredients(false)} style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                        <MaterialCommunityIcons name="chevron-left" size={20} color="#8B5CF6" />
                        <Text style={{ color: "#8B5CF6", fontWeight: "600" }}>Retour</Text>
                    </TouchableOpacity>
                    <View style={styles.directionRow}>
                        <View style={styles.circle}>
                            <MaterialCommunityIcons name="package-variant" size={20} color="#8B5CF6" />
                        </View>
                        <View style={{ flexDirection: "column", alignContent: "center" }}>
                            <Text style={styles.title}>Niveau Stock</Text>
                            <Text style={styles.stockLabel}>Mis à jour il y a 2 min</Text>
                        </View>
                    </View>
                </View>

                {ingredients.map((ingredient) => {
                    

                    return (
                        <CardIngredient key={ingredient.id} ingredient={ingredient}>

                        </CardIngredient>
                        
                    );
                })}

                {ingredientsEnAlerte.length > 0 && (
                    <View style={styles.alert}>
                        <Text style={styles.alertText}>
                            ⚠️ Rupture imminente — {ingredientsEnAlerte.map((i) => i.nom).join(', ')}
                        </Text>
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={handleAddIngredient}>
                <MaterialCommunityIcons name="plus" size={28} color="#fff" />
            </TouchableOpacity>

            <ModalAjoutIngredient
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                ingredient={ingredientModal}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, marginHorizontal: 10, width: "96%", height: 500 },
    title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 5 },
    stockRow: { marginBottom: 12 },
    stockHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    stockLabel: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
    stockPct: { fontSize: 12, fontWeight: '700' },
    barBackground: { width: '100%', height: 10, backgroundColor: '#F3F4F6', borderRadius: 99, marginBottom: 10 },
    barFill: { height: 10, borderRadius: 99 },
    alert: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 10, marginTop: 4 },
    alertText: { fontSize: 12, fontWeight: '600', color: '#EF4444' },
    directionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    circle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 20,
        backgroundColor: '#F59E0B',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
      deleteAction: {
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        marginBottom: 20,
        marginRight: 10,
        borderRadius: 25,
        gap: 4,
    },
    deleteActionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});