import React from 'react'
import { View , Text, StyleSheet, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getMinutesElapsed} from '../../../../store/cuisineActions'


export default function CardAttentes({cmdAttente}) {
  return (
    <View style={styles.card}>
        <View style={{flexDirection:"row" , gap:6,alignItems:"center",marginBottom:10}} >
            <View style ={styles.circleDot} />
            <Text style={[styles.cardText , {textTransform: 'uppercase'}]}>  En attente </Text>
        </View>
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
            <View>
               <Text style={styles.cardTitle}> {cmdAttente.nature ==="place" ? `Table n°${cmdAttente.numeroTable}` : "A Exporter"} </Text>
              <Text style={{color:"#aeaeae"}}>{ `C-${cmdAttente.id}`}</Text>
            </View>
            <View style ={styles.circle}>
                <Text> {`il y a ${getMinutesElapsed(cmdAttente.dateCommande)} `}</Text>
            </View>
        </View>
        <View style={{flexDirection:"column" , gap:6,marginVertical:20}}>
            {cmdAttente.plats.map((plat, index) => (
                <View key={index} style={{flexDirection:"row", gap:6, alignItems:"center",marginBottom:10}}>
                    <View style={[styles.circleDot , {width:5, height:5,backgroundColor:"#F59E0B"}]} />
                    <Text style={styles.cardText}> {plat.nbre}x {plat.label} </Text>
                </View>
            ))}

        </View>

        <TouchableOpacity style={styles.buttonCard}> 
            <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#0f0f10" />
            <Text style = {[styles.cardText , {fontWeight:"bold", fontSize:18}]}> Lancer la préparation </Text>

        </TouchableOpacity>


    </View>
  )
}

const styles=StyleSheet.create({
     card : {
    backgroundColor: '#fff',
    padding: 15,
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
    width:"90%"
  } ,
  cardTitle: {  
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#070707',
    textTransform: 'uppercase',
  } ,
   cardText: { 
    fontSize: 15,
    color: '#010101',
  } ,
   textCommande: { 
    fontSize: 25,
    color: '#05b342',
    fontWeight: 'bold',
    marginBottom: 10,
  } ,
  textUnique: { 
    fontSize: 16 ,
     color: '#05b342', 
    paddingBottom: 13
 }, 
  circle:{
    borderRadius: 25, 
    backgroundColor: '#e7e7e2',
    justifyContent: 'center',
    alignItems: 'center',
    padding:5
  } ,
  circleDot:{
    width: 10,
    height: 10,
    borderRadius: 25, 
    backgroundColor: '#dbdbda',
    justifyContent: 'center',
    alignItems: 'center',
    
  } ,

  circleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#828488',
  } ,
  buttonCard : {
    flexDirection : "row",
    gap:6,
    color: "black",
    justifyContent:"center",
    backgroundColor:"#e7e7e2",
    borderRadius:15 ,
    padding: 15,
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
    width:"100%"
  }
})