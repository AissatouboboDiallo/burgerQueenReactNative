import React from 'react'
import { Text , View, StyleSheet,Alert } from 'react-native'
import { comptes } from '../../../../data'
import CardCompteSupport from './CardCompteSupport'
import ModalConfirmMotPass from './ModalConfirmMotPass'
import { useState } from 'react'
import ModalModifInfoUser from './ModalModifInfoUser'
import ModalModifMotPass from './ModalModifMotPass'
import { useAuthActions } from '../../../../store/useAuthActions'



export default function Compte() {
    const [modalConfirmeMotPass, setmodalConfirmeMotPass] = useState(false);
    const [modalModifInfoUser, setmodalModifInfoUser] = useState(false);
    const [password, setPassword] =useState('')
    const [modalModifMotPass,setmodalModifMotPass] = useState(false)
    const [modalModifMotPassUser,setmodalModifMotPassUser] = useState(false)

    const {handleModifInfoUser , getFirebaseErrorMessage, handleModifMotPass}=useAuthActions()

    const afficheModalModif = async (password) => {
    // 1. On ferme d'abord le modal de confirmation
    setmodalConfirmeMotPass(false);

    if (password) {
      setPassword(password)
    };


    // 2. On attend que l'animation de fermeture soit terminée avant d'ouvrir le suivant
    setTimeout(() => {
        setmodalModifInfoUser(true);
    }, 300);
  };

const modifInfoUser = async (nom,email) => {

  try {
    if (!nom || !email) {
      Alert.alert(" les champs sont vides !")
    }
    await handleModifInfoUser(email,nom,password)
    setmodalModifInfoUser(false)
    
  } catch (error) {
    Alert.alert("Error", getFirebaseErrorMessage(error.code))
  }    

  };
const modifMotPass = async (currentPassword,newPassword) => {

  try {
    await handleModifMotPass(currentPassword,newPassword)
    setmodalModifMotPassUser(false)
    
  } catch (error) {
    Alert.alert("Error", getFirebaseErrorMessage(error.code))
  }    
  console.log(currentPassword,newPassword);
  

  };
const afficheModalModifMotPass = async (password) => {
    // 1. On ferme d'abord le modal de confirmation
    setmodalModifMotPass(false);

    if (password) {
      setPassword(password)
    };


    // 2. On attend que l'animation de fermeture soit terminée avant d'ouvrir le suivant
    setTimeout(() => {
        setmodalModifMotPassUser(true);
    }, 300);
  };



  return (
    <View>
        <Text style={styles.cardTitle}>
            Compte
        </Text>
        <View style={styles.card}>
        {
            comptes.map((compte, index) =>(
                <View key={index}>
                <CardCompteSupport compteSupport={compte} setModalVisible={index ==comptes.length -1 ? setmodalModifMotPass : setmodalConfirmeMotPass}> </CardCompteSupport>
                { index != comptes.length -1 &&
                <View style={styles.ligne} />           
                }
                
                </View>
            ))
        }


        </View>
        <ModalConfirmMotPass
            visible={modalConfirmeMotPass}
            onClose={() => setmodalConfirmeMotPass(false)}
            onConfirm={afficheModalModif}
            text="modificationInfoUser"
        />

        <ModalModifInfoUser
        visible={modalModifInfoUser}
        onClose={() => setmodalModifInfoUser(false)}
        onModif={modifInfoUser}

        />

        <ModalConfirmMotPass
            visible={modalModifMotPass}
            onClose={() => setmodalModifMotPass(false)}
            onConfirm={afficheModalModifMotPass}
            text="modificationMotPass"
        />

        <ModalModifMotPass
        visible={modalModifMotPassUser}
        onClose={() => setmodalModifMotPassUser(false)}
        onModif={modifMotPass}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
        backgroundColor: '#fff',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: "column",
        alignSelf:"center",
        gap: 6,
        width: "96%",
        margin:10 // ← occupe tout l'espace donné par "wrapper"
    },  
     cardTitle: {  
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#787b81',
    textTransform: 'uppercase',
    marginRight: 15,
    marginTop:10
  } ,
  ligne : {
    height:0.5,
    width:"100%",
    backgroundColor:"#828488"
  }
})