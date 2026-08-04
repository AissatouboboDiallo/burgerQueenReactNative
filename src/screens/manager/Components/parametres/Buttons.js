import React, { useState } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { parametreActions } from './parametreActions';
import { useAuthActions } from '../../../../store/useAuthActions';
import { useSelector } from 'react-redux';
import ModalConfirmMotPass from './ModalConfirmMotPass';
export default function Buttons() {
  const { logoutUser } = parametreActions();
  const { handleDeleteAccount } = useAuthActions();
  const user = useSelector((state) => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);

  const confirmerSuppression = async (password) => {
    try {
      await handleDeleteAccount(user.email, password);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erreur', "Mot de passe incorrect ou erreur de suppression. Réessaie.");
      console.error('Erreur suppression compte :', error);
    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.card} onPress={logoutUser}>
              <MaterialCommunityIcons name="logout" size={20} color="#000000" />
              <Text style={styles.title}> Se déconnecter </Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.card, { backgroundColor: "rgb(255, 185, 185)" }]} 
            onPress={() => setModalVisible(true)}
        >
              <MaterialCommunityIcons name="account-remove-outline" size={20} color="#f70808" />
              <Text style={[styles.title, { color: "#f00" }]}> Supprimer le compte </Text>
        </TouchableOpacity>
        <Text style={{ alignSelf: "center", marginTop: 30 }}> BurgerQueen • Fait avec 🍔 pour votre équipe</Text>

        <ModalConfirmMotPass
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onModif={confirmerSuppression}
            text="suppression"
        />
    </View>
  )
}

const styles = StyleSheet.create({
  card : {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
    flexDirection:"row",
    justifyContent:"center" ,
    alignItems:"center", 
    gap:10
  } ,
  container: {
    marginVertical:20,
    marginHorizontal:10,
  } ,
   title: {  
    fontSize: 12,
    fontWeight: 'bold',
    color: '#070707',
    textTransform: 'uppercase',
  } ,
})