import React from 'react'
import { View , Text } from 'react-native'
import { commandes } from '../../../../data'
import { ScrollView } from 'react-native'
import CardCuisson from './CardCuisson'

export default function Cuisson() {
  const commandesCuisson = commandes.filter((cmd) => cmd.status ==="cuisson"  )
 
   return (
       <View style={{ width:"100%", flexDirection:"column", flexWrap:"wrap",gap:6 , alignContent:"center", justifyContent:"center",marginVertical:10}}>
 
           {commandesCuisson.map((cmd, index) =>(
             <CardCuisson key={index} cmdCuisson={cmd}> </CardCuisson>
 
           ))}
       </View>               
   )
}
