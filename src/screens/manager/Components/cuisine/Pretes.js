import React from 'react'
import { View, Text } from 'react-native'
import CardPretes from './CardPretes'
import { setCommandesRealtime } from '../../../../store/redux/commandesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { subscribeToCommandes } from '../../../../services/commandesServices'
import { useEffect } from 'react'


export default function Pretes() {
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

  const commandesPretes = commandes.filter((cmd) => cmd.status ==="prete"  )
  
    return (
        <View style={{ width:"100%", flexDirection:"column", flexWrap:"wrap",gap:6 , alignContent:"center", justifyContent:"center",marginVertical:10}}>
  
            {commandesPretes.map((cmd, index) =>(
              <CardPretes key={index} cmdPrete={cmd}> </CardPretes>
  
            ))}
        </View>               
    )
}

