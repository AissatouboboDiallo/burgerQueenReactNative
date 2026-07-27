import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setIngredientsRealtime } from '../../../../store/redux/ingredientsSlice';
import { useEffect } from 'react';
import { subscribeToIngredients } from '../../../../services/igredientsServices';

// Calcule le pourcentage restant d'un ingrédient
const getPourcentage = (item) => {
    const pct = Math.round((item.quantiteActuelle / item.quantiteMax) * 100);
    return Math.max(0, Math.min(pct, 100));
};

// Détermine la couleur selon le niveau
const getColorProgress = (pct) => {
    if (pct <= 20) return '#EF4444'; // rouge - critique
    if (pct <= 50) return '#F59E0B'; // orange - moyen
    return '#22C55E'; // vert - ok
};


export default function StockSection({setaffTousIngredients}) {
      const dispatch = useDispatch();

      const mockIngredients = useSelector((state) => state.ingredients.list);
  
      useEffect(() => {
          // On démarre l'écoute au montage de l'écran
          const unsubscribe = subscribeToIngredients((ingredientsData) => {
              dispatch(setIngredientsRealtime(ingredientsData));
          });
  
          // On arrête l'écoute quand l'écran se démonte (bonne pratique, évite les fuites mémoire)
          return () => unsubscribe();
      }, []);

        // On identifie les ingrédients en rupture imminente (sous leur seuil d'alerte)
  const ingredientsEnAlerte = mockIngredients.filter((item) => {
      const pct = getPourcentage(item);
      return pct <= 20;
  });


  return (
    <View style={styles.card}>
        <View style={{flexDirection:"row", justifyContent:"space-between", alignContent:"center", marginTop:10, marginBottom:25, flex: 1}}>
         <View style={styles.directionRow}>
          <View style={styles.circle}>
            <MaterialCommunityIcons name="package-variant" size={20} color="#8B5CF6" />
          </View>
          <View style={{flexDirection:"column", alignContent:"center"}}>
            <Text style={styles.title}>
                Niveau Stock
            </Text>
            <Text style={styles.stockLabel}>
                Mis à jour il y a 2 min
            </Text>
          </View>
        
         </View>
         <TouchableOpacity onPress={() => setaffTousIngredients(true) }>
             <Text style={{ color: "#8B5CF6", fontWeight: "600" }}>
                Tout voir
            </Text>
        </TouchableOpacity>         
      </View>
        
      
      {mockIngredients.map((item) => {
          const pct = getPourcentage(item);
          const color = getColorProgress(pct);

          return (
            <View key={item.id} style={styles.stockRow}>

              {/* Nom + Pourcentage */}
              <View style={styles.stockHeader}>
                <Text style={styles.stockLabel}>{item.nom}</Text>
                <Text style={[styles.stockPct, { color }]}>
                  {pct}%
                </Text>
              </View>

              {/* Barre de fond */}
              <View style={styles.barBackground}>
                {/* Barre de remplissage */}
                <View
                  style={[
                    styles.barFill,
                    { width: `${pct}%`, backgroundColor: color },
                  ]}
                />
              </View>

            </View>
          );
      })}

      {/* Alerte rupture — dynamique selon les vrais ingrédients critiques */}
      {ingredientsEnAlerte.length > 0 && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>
            ⚠️ Rupture imminente — {ingredientsEnAlerte.map(i => i.label).join(', ')}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card:          { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, marginTop:300,shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 , 
  marginHorizontal:10, 

 },
  title:         { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 5 },
  stockRow:      { marginBottom: 12 },
  stockHeader:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  stockLabel:    { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  stockPct:      { fontSize: 12, fontWeight: '700' },
  barBackground: { width: '100%', height: 10, backgroundColor: '#F3F4F6', borderRadius: 99, marginBottom:10 },
  barFill:       { height: 10, borderRadius: 99 },
  alert:         { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 10, marginTop: 4 },
  alertText:     { fontSize: 12, fontWeight: '600', color: '#EF4444' },
  directionRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  circle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
});