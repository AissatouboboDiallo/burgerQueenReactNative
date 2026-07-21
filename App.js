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

// s'il est connecté alors on lui redirige vers la bonne page
  if (user) {
    return <ManagerDashboard />;
  } else {
    // sinon vers le login 
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