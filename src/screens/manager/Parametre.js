import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Compte from './Components/parametres/Compte'
import Profil from './Components/parametres/Profil'
import Support from './Components/parametres/Support'
import Buttons from './Components/parametres/Buttons'
import Preferences from './Components/parametres/Preferences'
import { ScrollView } from 'react-native'

export default function Parametre() {
  return (
    <View style={{ flex: 1 , flexDirection:"column", padding:10, gap:10, height:70, width:"100%"}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View> 
        <Text style={styles.title} > Paramètres </Text>
        <Text style={styles.text} > Personnalisez votre expérience</Text>
      </View>
      <Profil>  </Profil>
      <Preferences>     </Preferences>
      <Compte>  </Compte>
      <Support> </Support>
      <Buttons> </Buttons>

      </ScrollView>
      
    </View>

   
  )

}

const styles = StyleSheet.create({
      title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 5 },
        text: { fontSize: 16 , color: '#6B7280', paddingBottom: 13 }, 

  })
