import React from 'react'
import { View , Text , TouchableOpacity, StyleSheet } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getMinutesElapsed} from '../../../../store/cuisineActions'
import { cuisineCommandeActions } from './ActionsCuisine';


export default function CardServi({cmdServi}) {
  const {formatDeliveryDate, formatDeliveryTime } = cuisineCommandeActions()
  return (
    <View style={styles.card}>
                  <View style={{flexDirection:"row" , gap:6,alignItems:"center",marginBottom:10}} >
                      <View style ={styles.circleDot} />
                      <Text style={[styles.cardText , {textTransform: 'uppercase'}]}>  Servi </Text>
                  </View>
                  <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                      <View>
                         <Text style={styles.cardTitle}> {cmdServi.nature ==="place" ? `Table n°${cmdServi.numeroTable}` : "A Exporter"} </Text>
                        <Text style={{color:"#aeaeae"}}>{ `C-${cmdServi.id}`}</Text>
                      </View>
                      <View style ={styles.circle}>
                          <Text> {`${getMinutesElapsed(cmdServi.updatedAt)}`}</Text>
                      </View>
                  </View>
                  <View style={{flexDirection:"column" , gap:6,marginVertical:20}}>
                      {cmdServi.plats.map((plat, index) => (
                          <View key={index} style={{flexDirection:"row", gap:6, alignItems:"center",marginBottom:10}}>
                              <View style={[styles.circleDot , {width:5, height:5}]} />
                              <Text style={styles.cardText}> {plat.nbre}x {plat.label} </Text>
                          </View>
                      ))}
          
                  </View>
                  <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Total de la commande</Text>
                      <Text style={styles.totalValue}>{cmdServi.total} GNF</Text>
                  </View>
          
                  <TouchableOpacity style={styles.buttonCard}  > 
                      <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#eef2fa" />
                      <Text style = {[styles.cardText, {fontWeight:"bold" , color:"#fff",fontSize:18}]}> Déjà Servi </Text>
          
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
              backgroundColor: '#10B981',
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
              backgroundColor:"#10B981",
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
            } , 
            deliveryBox: {
  backgroundColor: '#FFF7ED',
  borderWidth: 1,
  borderColor: '#FDE68A',
  borderRadius: 18,
  padding: 12,
  marginTop: 0,
  marginBottom: 14,
},
deliveryHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  marginBottom: 6,
},
deliveryLabel: {
  fontSize: 13,
  fontWeight: '700',
  color: '#92400E',
  textTransform: 'uppercase',
},
deliveryContent: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 6,
},
deliveryDate: {
  fontSize: 15,
  fontWeight: '700',
  color: '#111827',
},
deliveryTime: {
  fontSize: 15,
  color: '#374151',
},
totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6fdf5',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 6,
},
totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#070707',
},
totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
},
})