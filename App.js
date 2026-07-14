import React from 'react';  
import { Provider } from 'react-redux';
import { store } from './src/store/store';  
import LoginScreen from './src/screens/LoginScreen';
import ManagerDashboard from './src/screens/manager/ManagerDashboard';
import CuisinierDashboard from './src/screens/cuisinier/CuisinierDashboard';
import { useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// On crée un sous-composant pour pouvoir utiliser le hook useSelector
function RootNavigator() {
  // On récupère l'utilisateur connecté dans Redux
  const user = useSelector((state) => state.auth.user);

  // 1. Si aucun utilisateur n'est connecté -> Écran de Connexion / Inscription
  if (!user) {
    return <LoginScreen />;
  }

  // 2. Si l'utilisateur est connecté, on l'oriente selon son rôle
  if (user.role === 'manager') {
    return <ManagerDashboard />;
  } else if (user.role === 'cuisinier') {
    return <CuisinierDashboard />;
  } else {
    // Optionnel : Cas de secours si le rôle n'est pas reconnu
    return <LoginScreen />;
  }

}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
          <Provider store={store}>
            <RootNavigator />
          </Provider>
    </GestureHandlerRootView>


  );
}