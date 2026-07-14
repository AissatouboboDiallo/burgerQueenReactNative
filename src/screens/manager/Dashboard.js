import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet } from 'react-native';
import StockSection from './Components/Dashboard/StockSection';
import { ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AperçuCuisine from './Components/Dashboard/AperçuCuisine';
import { useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { getDoc,getDocs,collection } from 'firebase/firestore';

export default function Dashboard() {

 const today = new Date();

  const formattedDate = today.toLocaleDateString("fr-FR", {
    weekday: "long",   // mercredi
    year: "numeric",   // 2026
    month: "long",     // juillet
    day: "numeric"     // 14
  });

  return (
    <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.containerTop}>
            <Text style={styles.text}>{formattedDate} </Text>
           <View style={styles.top}>
            <Text style={styles.title}>Bonjour, Manager 👑</Text>
            <View style={styles.circle}>
              <MaterialCommunityIcons name="bell" size={20} color="#f4b60b" />
            </View>
          </View>
         </View>
    
          <View style={styles.grid}>
            <View style={styles.card}>
              <View style={styles.directionRow}>
                <Text style={styles.cardTitle}>CA DU JOUR</Text>
                <View style={styles.circle}>
                  <MaterialCommunityIcons name="trending-up" size={20} color="#10B981" />
                </View>
              </View>
                 <Text style={styles.cardTextUnique}>1240 $</Text>
                 <Text style={styles.textUnique}>+12% vs hier</Text>
    
            </View>
    
            <View style={styles.card}>
              <View style={styles.directionRow}>
                <Text style={styles.cardTitle}>En attente</Text>
                <View style={styles.circle}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#F59E0B" />
                </View>
              </View>
                 <Text style={styles.cardText}>8 </Text>
                 <Text style={styles.text}>commandes actives</Text>
    
            </View>
    
            <View style={styles.card}>
              <View style={styles.directionRow}>
                <Text style={styles.cardTitle}>Couverts</Text>
                <View style={styles.circle}>
                  <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#3B82F6" />
                </View>
              </View>
                 <Text style={styles.cardText}>143 </Text>
                 <Text style={styles.text}>clients servis</Text>
    
            </View>
    
            <View style={styles.card}>
              <View style={styles.directionRow}>
                <Text style={styles.cardTitle}>Ticket Moy</Text>
                <View style={styles.circle}>
                  <MaterialCommunityIcons name="package-variant" size={20} color="#420bf5" />
                </View>
              </View>
                 <Text style={styles.cardText}>8.67$ </Text>
                 <Text style={[styles.text , styles.colorPurple]}>+0.40 $</Text>
            </View>
            
          </View>
          <StockSection />
          <AperçuCuisine />
          
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', backgroundColor: '#FFF' , display: 'flex', flexDirection: 'column', position: 'relative' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#fff' },
  text: { fontSize: 16 , color: '#6B7280', paddingBottom: 13 }, 
  button: {
    backgroundColor: '#ffd9b6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  containerTop : {
    backgroundColor: '#000',
    paddingBottom: 50,
    paddingTop:20,
    paddingHorizontal: 15,
  } ,
  buttonText: { 
    color: '#e88e3f',
    fontSize: 16,
  },
  card : {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    width: '48%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  } ,
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  } ,
  cardTitle: {  
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#828488',
    textTransform: 'uppercase',
    marginRight: 15,
  } ,
  cardTextUnique: { 
    fontSize: 25,
    color: '#05b342',
    fontWeight: 'bold',
    marginBottom: 10,
  } ,
  textUnique: { fontSize: 16 , color: '#05b342', paddingBottom: 13 }, 

  cardText: { 
    fontSize: 25,
    color: '#0a0b0c',
    fontWeight: 'bold',
    marginBottom: 10,
  } ,
  circle:{
    width: 30,
    height: 30,
    borderRadius: 25, 
    backgroundColor: '#e7e7e2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  } ,
  circleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#828488',
  } ,
  grid: {
    flexDirection: 'row',
    gap: 10,
    position: 'absolute',
    flexWrap: 'wrap',
    top: 100,
    zIndex: 20,
    paddingHorizontal: 10,
    width: '100%',
  }
  ,
  directionRow : { 
    flexDirection: 'row',
    justifyContent: 'space-between',
  } ,
  directionColumn : {
    flexDirection: 'column',
    justifyContent: 'space-between',

  } ,
  icon : {
    fontSize: 15,
  } ,
  colorGreen : {
    color: '#05b342',
  } ,
  colorPurple : {
    color: '#8b5cf6',
  } ,
  colorBlue : {
    color: '#3b82f6',
  } ,
  colorOrange : {
    color: '#f97316',
  } ,

}); 