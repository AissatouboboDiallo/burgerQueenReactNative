import React from 'react'
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CardCompteSupport({compteSupport, setModalVisible}) {
  return (
    <View style={styles.container}>
        <View style={styles.direction}>
            <View style={[styles.circle , {height:40, width:40}]}>
                    <MaterialCommunityIcons name={compteSupport.icon} size={20} color="#000000" />                         
            </View>
            <View >
                <Text style={styles.title} >
                    {compteSupport.title}
                </Text>
                <Text style={styles.text}>
                    {compteSupport.text}
                </Text>
            </View>
        </View>
            <TouchableOpacity onPress={() => setModalVisible(true)}> 
                <MaterialCommunityIcons name="chevron-right" size={20} color="#000" />
            </TouchableOpacity>  

             
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
        flexDirection:"row",
        justifyContent:"space-between",
        padding: 20,
        alignItems:"center"
    },
    direction: {
    flexDirection:"row",
    gap:15,
    justifyContent:"center",
    alignContent:"center"
    } ,
    circle:{
    width: 80,
    height: 80,
    borderRadius: 30, 
    backgroundColor: '#dbdbda',
    justifyContent: 'center',
    alignItems: 'center',
    
  } ,
  title: {  
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#070707',
    textTransform: 'uppercase',
  } ,
text: { fontSize: 12 , color: '#6B7280' }, 
 switch : {
    backgroundColor:"#F59E0B"
 }
})