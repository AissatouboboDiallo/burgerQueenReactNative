import React from 'react'
import { Text , View, StyleSheet } from 'react-native'
import { preferences } from '../../../../data' 
import CardPreferences from './CardPreferences'

export default function Preferences() {
  return (
    <View>
        <Text style={styles.cardTitle}>
            Préférences
        </Text>
        <View style={styles.card}>
        {
            preferences.map((preference, index) =>(
                <View key={index}>
                <CardPreferences preference={preference} > </CardPreferences>
                { index != preferences.length -1 &&
                <View style={styles.ligne} />           
                }
                
                </View>
            ))
        }


        </View>
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