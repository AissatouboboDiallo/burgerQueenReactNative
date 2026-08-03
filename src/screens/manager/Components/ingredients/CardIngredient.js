import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet ,Alert } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { removeIngredient } from '../../../../store/redux/ingredientsSlice';
import ingredientActions from './ingredientActions';
import { useDispatch } from 'react-redux';

export default function CardIngredient({ingredient, setModalVisible, setIngredientModal}) {
    const {getColorProgress, getPourcentage} =ingredientActions()
    const pct = getPourcentage(ingredient);
    const color = getColorProgress(pct);
    const dispatch = useDispatch() ;

    
    const handleEditIngredient = (item) => {
        setIngredientModal(item);
        setModalVisible(true);
    };
    
       

    const handleDelete = () => {
            Alert.alert(
                'Supprimer ce ingredient',
                `Es-tu sûre de vouloir supprimer "${ingredient.nom}" ?`,
                [
                    { text: 'Annuler', style: 'cancel' },
                    {
                        text: 'Supprimer',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await dispatch(removeIngredient(ingredient.id)).unwrap();
    
                            } catch (error) {
                                Alert.alert('Erreur', 'Impossible de supprimer cet ingredient.');
                                console.error('Erreur suppression ingredient :', error);
                            }
                        },
                    },
                ]
            );
        };
    
        // Rendu du bouton rouge révélé par le swipe vers la gauche
        const renderRightActions = () => (
            <TouchableOpacity style={styles.deleteAction} onPress={handleDelete}>
                <Text style={styles.deleteActionText}>Supprimer</Text>
            </TouchableOpacity>
        );
  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false} key={ingredient.id} >
        
                            <TouchableOpacity
                                
                                style={styles.stockRow}
                                onPress={() => handleEditIngredient(ingredient)}
                            >
                                <View style={styles.stockHeader}>
                                    <Text style={styles.stockLabel}>{ingredient.nom}</Text>
                                    <Text style={[styles.stockPct, { color }]}>{pct}%</Text>
                                </View>
                                <View style={styles.barBackground}>
                                    <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
                                </View>
                            </TouchableOpacity>
                                
   </Swipeable>
  )
}

const styles = StyleSheet.create({
     stockRow: { marginBottom: 12 },
    stockHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    stockLabel: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
    stockPct: { fontSize: 12, fontWeight: '700' },
    barBackground: { width: '100%', height: 10, backgroundColor: '#F3F4F6', borderRadius: 99, marginBottom: 10 },
    barFill: { height: 10, borderRadius: 99 },
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
})
