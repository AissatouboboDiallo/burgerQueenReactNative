import React from 'react'
import { View, Text } from 'react-native'
import { setCommandesRealtime } from '../../../../store/redux/commandesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { subscribeToCommandes } from '../../../../services/commandesServices'
import { useEffect } from 'react'
import CardServi from './CardServi'


export default function Servi() {
   const dispatch = useDispatch()
   const commandes = useSelector((state) => state.commandes.list);
  
      useEffect(() => {
          // On démarre l'écoute au montage de l'écran
          const unsubscribe = subscribeToCommandes((commandesData) => {
              dispatch(setCommandesRealtime(commandesData));
          });
  
          // On arrête l'écoute quand l'écran se démonte (bonne pratique, évite les fuites mémoire)
          return () => unsubscribe();
      }, []);

  const cmdServi = commandes.filter((cmd) => cmd.status ==="servi"  )
  
    return (
        <View style={{ width:"100%", flexDirection:"column", flexWrap:"wrap",gap:6 , alignContent:"center", justifyContent:"center",marginVertical:10}}>
  
            {cmdServi.map((cmd, index) =>(
              <CardServi key={index} cmdServi={cmd}> </CardServi>
  
            ))}
        </View>               
    )
}

