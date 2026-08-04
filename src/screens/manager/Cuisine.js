import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity,  } from 'react-native'
import ModelTitle from './Components/Dashboard/ModelTitle'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState , useEffect} from 'react';
import Toutes from './Components/cuisine/Toutes';
import Attentes from './Components/cuisine/Attentes';
import Pretes from './Components/cuisine/Pretes';
import Cuisson from './Components/cuisine/Cuisson';
import { ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { setCommandesRealtime } from '../../store/redux/commandesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeToCommandes } from '../../services/commandesServices';
import ModalAjouterCommande from './Components/cuisine/ModalAjouterCommande';
import Servi from './Components/cuisine/Servi';



export default function Cuisine() {

      const [modalCommandeVisible, setModalCommandeVisible] = useState(false);
      const dispatch = useDispatch()
      
      const commandes = useSelector((state) => state.commandes.list);
      const [produitPourCommande, setProduitPourCommande] = useState(null);


        useEffect(() => {
            const unsubscribe = subscribeToCommandes((dataCommande) => {
                dispatch(setCommandesRealtime(dataCommande));
            });
            return () => unsubscribe();
        }, []);

        // Pour ouvrir la modal SANS présélection (bouton "+" classique)
        const handleNouvelleCommandeVide = () => {
            setProduitPourCommande(null);
            setModalCommandeVisible(true);
        };

        const totalCommandes = commandes.length;
        const commandesEnAttente = commandes.filter((cmd) => cmd.status === 'attente').length;
        const commandesEnCuisson = commandes.filter((cmd) => cmd.status === 'cuisson').length;
        const commandesPretes = commandes.filter((cmd) => cmd.status === 'prete').length;
        const cmdServi = commandes.filter((cmd) => cmd.status === 'servi').length;


        const [filtre1, setfiltre] = useState(0); // État pour suivre l'onglet actif
        const listFiltre = [
        { label: 'Toutes', nbre: totalCommandes, value: 0, component: <Toutes /> },
        { label: 'En attente', nbre: commandesEnAttente, value: 1, component: <Attentes /> },
        { label: 'En cuisson', nbre: commandesEnCuisson, value: 2, component: <Cuisson /> },
        { label: 'Prêtes', nbre: commandesPretes, value: 3, component: <Pretes /> },
        { label: 'Servi', nbre: cmdServi, value: 4, component: <Servi /> },
    ];

  return (
     <View style={styles.container}>
         <ModelTitle title={"Cuisine Live"} littleTitle={"4 commandes actives"}  icons={"filter-outline"}></ModelTitle>
       <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.listFiltre}

        >
        {listFiltre.map((filtre) => (
            <TouchableOpacity
            key={filtre.label}
            style={[styles.filtre, filtre.value == filtre1 && styles.filtreActive]}
            onPress={() => setfiltre(filtre.value)}
            >
            <Text style={[styles.labelFiltre, filtre.value == filtre1 && styles.labelActive]}>
                {filtre.label}
            </Text>

            <View style={[styles.circle, filtre.value == filtre1 && styles.circleActive]}>
                <Text>{filtre.nbre}</Text>
            </View>
            </TouchableOpacity>
        ))}
        </ScrollView> 


        <View style = {{width:"100%",height:510}}>
        <ScrollView showsVerticalScrollIndicator={false} >
            
             {listFiltre[filtre1].component}  
        </ScrollView>


        </View>

        <TouchableOpacity 
            style={styles.fab} 
            onPress={handleNouvelleCommandeVide}
        >
            <MaterialCommunityIcons name="plus" size={28} color="#fff" />
        </TouchableOpacity>

        <ModalAjouterCommande
            visible={modalCommandeVisible}
            onClose={() => {
        setModalCommandeVisible(false);
        setProduitPourCommande(null);   // 🔧 réinitialise ici aussi
         }}
        produitPreselectionne={produitPourCommande}

        />

       
    </View>     
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        borderRadius:20,
        flexDirection:"column", 
        justifyContent:"flex-start", 
        alignContent:"flex-start", 

    } ,
    listFiltre : {
        flexDirection:"row",
        backgroundColor:'#ff0000 ',       
        margin:10,
        paddingVertical: 20,
        gap:6,   
        height:80,
    } ,
    filtre : {
       flexDirection:"row",
       gap:10,
       padding:10, 
       backgroundColor: '#e5e3e3',
       borderRadius:20,
       alignItems:"center",
       paddingHorizontal:10,
    } ,
    circle:{
    width: 20,
    height: 20,
    borderRadius: 25, 
    backgroundColor: '#dbdbda',
    justifyContent: 'center',
    alignItems: 'center',
    
  } ,
   circleActive:{
    width: 20,
    height: 20,
    borderRadius: 25, 
    backgroundColor: '#d39206',
    justifyContent: 'center',
    alignItems: 'center',
    
  } ,
    filtreActive : {
       backgroundColor: 'rgb(0, 0, 0)'
    } ,
    labelActive : {
        color: '#dbdbda',
    } ,
    labelFiltre : {
        color: '#939394',
        fontSize: 15,
        fontWeight:"bold"
    } ,
    fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    color:"#000",
    borderRadius: 20,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
}

    


})
