import React from 'react'
import { View , Text , StyleSheet, TouchableOpacity} from 'react-native' 
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { subscribeToCommandes } from '../../../../services/commandesServices';
import { setCommandesRealtime } from '../../../../store/redux/commandesSlice';  
import { useDispatch , useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function AperçuCuisine() {
   const dispatch = useDispatch()
   const commandes = useSelector((state) => state.commandes.list);
  
      useEffect(() => {
          // On démarre l'écoute au montage de l'écran
          const unsubscribe = subscribeToCommandes((commandesData) => {
              dispatch(setCommandesRealtime(commandesData));
          });
  
          // On arrête l'écoute quand l'écran se démonte (bonne pratique, évite les fuites mémoire)
          return () => unsubscribe();
      }, []);

  const commandesAttentes = commandes.filter((cmd) => cmd.status ==="attente"  )
  return (
    <View style={styles.container}>
         <View style={styles.directionRow}>
          <View style={styles.circle}>
            <Ionicons name="fast-food-outline" size={24} color={'#0F172A'}   />
          </View>
          <View style={{flexDirection:"column", alignContent:"center"}}>
            <Text style={styles.title}>
                {commandesAttentes.length} commandes en  cours
            </Text>
            <Text style={styles.stockLabel}>
                Temps moyen : 6 min 42 s
            </Text>
          </View>
         </View>       
      </View>
  )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000",
        borderRadius:20,
        flexDirection:"row", justifyContent:"space-between", alignContent:"center", margin:10, flex: 1,padding:20

    }
    ,   stockLabel:    { fontSize: 14, fontWeight: '500', color: '#6B7280' },
     title:         { fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 5 },
    directionRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 15 },
  circle: { width: 50, height: 50, borderRadius: 30, backgroundColor: '#F59E0B', justifyContent: 'center', alignItems: 'center' },


})
