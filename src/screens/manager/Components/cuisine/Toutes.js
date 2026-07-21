import React from 'react'
import { View , Text } from 'react-native'
import CardAttentes from './CardAttentes'
import CardCuisson from './CardCuisson'
import CardPretes from './CardPretes'
import { useDispatch,useSelector } from 'react-redux'
import { subscribeToCommandes } from '../../../../services/commandesServices'
import { setCommandesRealtime } from '../../../../store/redux/commandesSlice'
import { useEffect } from 'react'
import { ScrollView } from 'react-native'
import CardServi from './CardServi'

export default function Attentes() {

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


  return (
      <View style={{ width:"96%", flexDirection:"column", flexWrap:"wrap",gap:6 , alignItems:"center", marginVertical:10, marginHorizontal:'auto'}}>

          {commandes.map((cmd, index) =>{
            if(cmd.status ==="attente") {
              return <CardAttentes key={index} cmdAttente={cmd}>  </CardAttentes>
            } ;

            if (cmd.status ==="cuisson") {
              return <CardCuisson key={index} cmdCuisson={cmd}>  </CardCuisson>
            } ;

            if(cmd.status ==="prete") {
              return <CardPretes key={index} cmdPrete={cmd}>  </CardPretes>
            } ;
            if(cmd.status ==="servi") {
              return <CardServi key={index} cmdServi={cmd}>  </CardServi>
            } ;


          }

          )}
      </View>               
  )
}
