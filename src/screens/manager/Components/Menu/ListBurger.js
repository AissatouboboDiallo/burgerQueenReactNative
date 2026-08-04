import React from 'react'
import { View , TouchableOpacity , Text , StyleSheet, ScrollView,Switch } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import ModalAjouterBurger from './ModalAjouterBurger';
import { Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler'; 
import { removeProduit } from '../../../../store/redux/produitsSlice';
import { useDispatch, useSelector } from 'react-redux';
import ModalAjouterCommande from '../cuisine/ModalAjouterCommande';

export default function ListBurger({burger, onEdit, setModalVisible, setburgerModal}) {
    const [toggle, setToggle] = useState(null)
    const [text,setText] = useState(false)
    const [showRupture,setshowRupture] = useState(!burger.disponible ? true : false)
    const [visible,setVisible]=useState(false)
    const dispatch = useDispatch()
    const [produitPourCommande, setProduitPourCommande] = useState(null);

    // Quand on clique sur un burger dans le menu pour créer directement sa commande
    const handleCommanderProduit = (produit) => {
        setProduitPourCommande(produit);
        setVisible(true);
    };

     const handleEditBurger = (editBurger) => {
             // dispatch Redux ou update Firebase ici
            console.log('Modifier burger:', editBurger);  
            setburgerModal(editBurger)          
            setModalVisible(true)

     
         };
    const ingredientList = useSelector((state) => state.ingredients.list)
    
    // Calcule si le produit est disponible selon le stock actuel des ingrédients de sa recette
const calculerDisponibilite = (recetteFormatee, ingredientsList) => {
    return recetteFormatee.some((item) => {
        const ingredient = ingredientsList.find(
            (ing) => ing.id === item.ingredientId
        );

        if (!ingredient) return false; // ou true selon ta logique métier

        return ingredient.enRupture === true;
    });
};


    const truncateText = (text ,maxLength = 25) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };
    const fullDescription = burger.desc.join(', ');
    const displayedDescription = truncateText(fullDescription, 20);

    const handleDelete = () => {
        Alert.alert(
            'Supprimer ce produit',
            `Es-tu sûre de vouloir supprimer "${burger.title}" ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await dispatch(removeProduit(burger.id)).unwrap();

                        } catch (error) {
                            Alert.alert('Erreur', 'Impossible de supprimer le produit.');
                            console.error('Erreur suppression produit :', error);
                        }
                    },
                },
            ]
        );
    };

    // Rendu du bouton rouge révélé par le swipe vers la gauche
    const renderRightActions = () => (
        <TouchableOpacity style={styles.deleteAction} onPress={handleDelete}>
            <MaterialCommunityIcons name="trash-can-outline" size={24} color="#fff" />
            <Text style={styles.deleteActionText}>Supprimer</Text>
        </TouchableOpacity>
    );


  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>

    <View style = {styles.card}>
        <View style={styles.circle}>
            <Text style={styles.img}>
              {burger.img}
            </Text>
        </View>
        <View style = {styles.contentBurger}>
            <View style={{flexDirection:"row",}}>
                <Text style = {styles.title} >
                    {/* { burger.disponible ? truncateText(burger.title,7)  : burger.title}   */}
                    {burger.title}
               </Text>
               {/* { burger.disponible && <Text style={{backgroundColor:"#ff9797",borderRadius:15,padding:5}}> Rupture  </Text> } */}
            </View>            
            <TouchableOpacity onPress={() =>setText(!text) } style={styles.text} >
                <Text>
                    { text === true ? fullDescription : truncateText(displayedDescription) }
                </Text>
            </TouchableOpacity> 
           <Text style = {[styles.title, {marginBottom:0, marginTop:10}]} >
            {`${burger.price} GNF`}
           </Text>
           <TouchableOpacity onPress={()=> handleCommanderProduit(burger)}>
            <Text style={[styles.text, {padding:3, flex:1, fontStyle:"italic"}]}> 
            cliquez pour commander
           </Text>
           </TouchableOpacity>
        </View>
        <View style = {styles.sectionButton}>
        <Switch value={burger.disponible}  
        trackColor={{ false: "#ccc", true: "#FF8C00" }} // orange burger
         />
        <TouchableOpacity style = {[styles.circle ,  {width:40, height:40}]}  onPress={() => handleEditBurger(burger)}> 
            <MaterialCommunityIcons name="pencil-outline" size={20} color="#000000" />
         </TouchableOpacity>
        </View>
       
    </View>
    <ModalAjouterCommande
    visible={visible}
     onClose={() => {
        setVisible(false);
        setProduitPourCommande(null);   // 🔧 réinitialise ici aussi
         }}
    produitPreselectionne={produitPourCommande}
    />
   </Swipeable>
  )
}

const styles = StyleSheet.create({
    card : {
    backgroundColor: '#fff',
    padding: 15,
    paddingHorizontal:20,
    borderRadius: 25,
    color: "#000",
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
    flexDirection:"column",
    gap:6,
    width:"95%",
    flexDirection:"row",
    justifyContent:"space-between",
    marginHorizontal:10

  } ,
    circle:{
    width: 80,
    height: 80,
    borderRadius: 25, 
    backgroundColor: '#dbdbda',
    justifyContent: 'center',
    alignItems: 'center',
    
  } ,
  title: {  
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#070707',
    textTransform: 'uppercase',
  } ,
  img : {
    fontSize:60
  } ,
  text :  {
  } ,
  sectionButton : {
    flexDirection:"column",
    gap:20,
    alignItems:"flex-end"
  } ,

  contentBurger : {
    flexDirection:"column",
    width:"50%"
  } ,
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
