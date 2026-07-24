import React from 'react'
import { Text , View , TouchableOpacity , StyleSheet} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import ModalModifInfoUser from './ModalModifInfoUser';


export default function Profil() {
  const user = useSelector((state) => state.auth.user)
   const initiale = user?.nom ? user.nom.charAt(0).toUpperCase() : '?';

  return (
    <View style = {styles.card}>
        <View style={styles.container}> 
            <View style={{flexDirection:"row", gap:10, alignItems:"center"}}>
                <View style={[styles.circleDot, {backgroundColor:"#F59E0B",padding:0}]}> 
                    <Text style={[styles.title, {fontSize:50}]}> {initiale} </Text>
                </View>
                <View style={styles.infoUser}>
                    <Text style={styles.title}> {user?.nom}</Text>
                    <Text style={styles.label}> {user?.email}</Text>
                    <View style={[styles.circleDot, {backgroundColor:"#ffe2b0", height:30, width:100,}]}>
                        <Text> 
                           { user?.role}
                        </Text>
                    </View>

                </View>

            </View>
            
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
     card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: "column",
        gap: 6,
        width: "96%",
        margin:5 // ← occupe tout l'espace donné par "wrapper"
    },
    container : {
        flexDirection:"row",
        justifyContent: "space-between" ,
        alignItems:"center"
    } ,
    circleDot:{
    width: 80,
    height: 80,
    borderRadius: 30, 
    backgroundColor: '#dbdbda',
    justifyContent: 'center',
    alignItems: 'center',
    
  } ,
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    letterSpacing: 0.5,
  },
  title: {  
    fontSize: 20,
    fontWeight: 'bold',
    color: '#070707',
    textTransform: 'uppercase',
  } ,
  infoUser : {
    flexDirection:"column",
    gap:6,
  }

})
