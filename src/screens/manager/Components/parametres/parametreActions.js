import { Alert } from "react-native";   
import { logout } from "../../../../store/authSlice";
import { useDispatch } from "react-redux";

export const parametreActions = () => {

    const dispatch = useDispatch()

    const logoutUser = async () => {
        Alert.alert(
                        'Déconnexion',
                        `Es-tu sûre de vouloir vous déconnectez  ?`,
                        [
                            { text: 'Non', style: 'cancel' },
                            {
                                text: 'Oui',
                                style: 'destructive',
                                onPress: async () => {
                                try {
                                    await dispatch(logout())
                                } catch (error) {
                                    Alert.alert("Error", error.message)
                                    console.log(error.message);
                                    
                                }

                                },
                            },
                        ]
                    );
    }

    return {logoutUser}
}