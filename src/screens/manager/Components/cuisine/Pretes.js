import React from 'react'
import { View, Text } from 'react-native'
import { commandes } from '../../../../data'
import CardPretes from './CardPretes'


export default function Pretes() {
  const commandesPrêtes = commandes.filter((cmd) => cmd.status ==="prete"  )
  
    return (
        <View style={{ width:"100%", flexDirection:"column", flexWrap:"wrap",gap:6 , alignContent:"center", justifyContent:"center",marginVertical:10}}>
  
            {commandesPrêtes.map((cmd, index) =>(
              <CardPretes key={index} cmdPrete={cmd}> </CardPretes>
  
            ))}
        </View>               
    )
}

