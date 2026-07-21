import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView ,TextInput , TouchableHighlight } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import ModelTitle from './Components/Dashboard/ModelTitle'
import { useState } from 'react';
import ListBurger from './Components/Menu/ListBurger';
import { burgers } from '../../data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ModalAjouterBurger from './Components/Menu/ModalAjouterBurger';
import { useEffect } from 'react';
import { setProduitsRealtime, createProduit, editProduit } from '../../store/redux/produitsSlice';
import { subscribeToProduits,  } from '../../services/produitsServices';
import { useDispatch , useSelector } from 'react-redux';
import { Alert } from 'react-native';
export default function Menu() {

  const [search, setSearch] = useState('')
   const [modalVisible, setModalVisible] = useState(false);
   const [modalEdit, setmodalEdit] = useState(false);
   const [burgerModal,setburgerModal] = useState(null)
   const  [loading,setLoading] =useState(false)
    
    const handleEditBurger = (burger) => {
        console.log('Modification de burger burger:', burger);
        // dispatch Redux ou update Firebase ici
        

    };
    const handleAddBurger = async (produitData) => {
        console.log("new produitData : ", produitData);
         try {
            if (produitData.id) {
            // Mode édition
            await dispatch(editProduit({ id: produitData.id, updates: produitData })).unwrap();
              Alert.alert("Modification effectué avec succès ! ")

            } else {
                // Mode ajout
                await dispatch(createProduit({ ...produitData, disponible: true })).unwrap();
              Alert.alert("Ajoute effectué avec succès ! ")

            }
              // await dispatch(createProduit(produitData)).unwrap();
          } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'ajouter le produit. Réessaie.');
              console.error('Erreur ajout produit :', error);
          } finally {
              setLoading(false);
          }

    };

    // SERVICE FIREBASE DE FIRESTORE

    const dispatch = useDispatch();
    const produits = useSelector((state) => state.produits.list);

    useEffect(() => {
        // On démarre l'écoute au montage de l'écran
        const unsubscribe = subscribeToProduits((produitsData) => {
            dispatch(setProduitsRealtime(produitsData));
        });

        // On arrête l'écoute quand l'écran se démonte (bonne pratique, évite les fuites mémoire)
        return () => unsubscribe();
    }, []);


  return (
    <View style={styles.container}>
         <ModelTitle title={"Gestion du menu"} littleTitle={"4 produits actifs sur 5"}  icons={"restaurant-outline"}></ModelTitle>
          <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>🔍</Text>
                      <TextInput 
                          style={styles.input}
                          placeholder="Rechercher un burger, une catégorie"
                          placeholderTextColor="#9CA3AF"
                          value={search}
                          onChangeText={setSearch}
                          keyboardType="search"
                          autoCapitalize="none"
                      />
          </View>
          <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:20, marginVertical:10}}>
            <Text style={styles.title}>
              Burgers
            </Text>
            <TouchableOpacity>
              <Text>
                 🔻Trier par catégorie
              </Text>
            </TouchableOpacity>
          </View>
        <View style = {{width:"100%",height:500}}>
        <ScrollView showsVerticalScrollIndicator={false} >
              <View style={{flexDirection:"column", gap:6,alignContent:"center", width:"100%"}}>
                {produits.map((burger) => (
                  <ListBurger  
                   burger={burger}  key={burger.id}
                   burgerModal={burgerModal}
                   setburgerModal={setburgerModal} 
                   setModalVisible = {setModalVisible}>

                    
                  </ListBurger>                  

                ))}
              </View>
        </ScrollView>

        </View>
        <TouchableOpacity 
            style={styles.fab} 
            onPress={() => { setburgerModal(null); setModalVisible(true); }}
        >
            <MaterialCommunityIcons name="plus" size={28} color="#fff" />
        </TouchableOpacity>
        
        <ModalAjouterBurger
            visible={modalVisible}
            onClose={() => { setModalVisible(false); setburgerModal(null); }}
            burger={burgerModal}
        />
              
    </View>     
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        borderRadius:20,
        flexDirection:"column", 
        justifyContent:"center", 
        alignContent:"center", 
        

    } ,
    inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ebe9e5',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginVertical: 20,
    marginHorizontal:20,
    height: 56,
    width:"90%"
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#9CA3AF',
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
  },
   title: {  
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#070707',
    textTransform: 'uppercase',
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
