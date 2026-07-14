import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {useState} from 'react';
import {logout} from '../../store/authSlice';
import { useAuthActions } from '../../store/useAuthActions'; // Importer le hook personnalisé
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dashboard from './Dashboard';
import Cuisine from './Cuisine';
import Menu from './Menu';
import Parametre from './Parametre';


export default function ManagerDashboard() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const { handleLogout } = useAuthActions();

  const [tab, setTab] = useState('dashboard'); // État pour suivre l'onglet actif
  const listOnglets = [
    { label: 'Dashboard', icon: 'grid-outline', value: 'dashboard', component: <Dashboard /> },
    { label: 'Cuisine', icon: 'fast-food-outline', value: 'kitchen', component: <Cuisine /> },
    { label: 'Menu', icon: 'restaurant-outline', value: 'menu', component: <Menu /> },
    { label: 'Paramètres', icon: 'settings-outline', value: 'settings', component: <Parametre /> },
  ]
  return (
    <SafeAreaView style={styles.container}>
      {listOnglets[listOnglets.findIndex(onglet => onglet.value === tab)].component}
      <View style={styles.containerAppBar}>
        {listOnglets.map((onglet) => (
          <Pressable key={onglet.value} style={[styles.nav, tab === onglet.value && styles.itemActive]} onPress={() => setTab(onglet.value)}>
            <Ionicons name={onglet.icon} size={24} color={tab === onglet.value ? '#0F172A' : '#64748B'}   />
            <Text style={[styles.label, tab === onglet.value && styles.labelActive]}>{onglet.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
    
  );

}
const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#fff' },
  text: { fontSize: 16 , color: '#6B7280', paddingBottom: 13 }, 
  container: { flex: 1, justifyContent: 'space-between', backgroundColor: '#FFF' , zIndex:20},
  button: {
    backgroundColor: '#ffd9b6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  containerAppBar:{
  width: '100%',
    maxWidth: 448,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
}
 ,
  nav: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 12,
  } ,

   itemActive: {
    backgroundColor: '#F59E0B',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  labelActive: {
    color: '#0F172A',
  },
 
 

}); 
