// hooks/useCommandeActions.js
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import { editCommande , removeCommande } from '../../../../store/redux/commandesSlice';
import { createdAt } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';

export const cuisineCommandeActions = () => {
    const dispatch = useDispatch();

      const formatDeliveryDate = (dateString) => {
      if (!dateString) return '';
    
      const today = new Date();
      const selected = new Date(dateString);
    
      const todayStr = today.toISOString().split('T')[0];
      const selectedStr = selected.toISOString().split('T')[0];
    
      if (todayStr === selectedStr) {
        return 'Aujourd’hui';
      }
    
      return selected.toLocaleDateString('fr-FR');
    };
    
    const formatDeliveryTime = (timeString) => {
      if (!timeString) return '';
      return timeString;
    };

    const handleUpdateCmd = async (id, status) => {
        try {
            await dispatch(
                editCommande({
                    id,
                    updates: {status}
                })
            ).unwrap();

        } catch (error) {
            Alert.alert('Erreur', error?.message || "Impossible de modifier la commande.");
            console.log("MESSAGE D'ERREUR :", error);
        }
    };

    const handleDelete = (cmd) => {
            Alert.alert(
                'Supprimer cette commande',
                `Es-tu sûre de vouloir supprimer "${cmd.id}" ?`,
                [
                    { text: 'Annuler', style: 'cancel' },
                    {
                        text: 'Supprimer',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await dispatch(removeCommande(cmd.id)).unwrap();
    
                            } catch (error) {
                                Alert.alert('Erreur', 'Impossible de supprimer cette commande.');
                                console.error('Erreur suppression de la commande :', error.message);
                            }
                        },
                    },
                ]
            );
        };
    

   

    return { handleUpdateCmd , formatDeliveryDate,formatDeliveryTime, handleDelete };
};