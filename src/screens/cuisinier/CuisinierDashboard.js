import React from 'react';
import { View, Text, StyleSheet, Button, TouchableHighlight, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {logout} from '../../store/authSlice';
import { useAuthActions } from '../../store/useAuthActions'; // Importer le hook personnalisé
export default function CuisinierDashboard() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const { handleLogout } = useAuthActions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍳 Écran Cuisine</Text>
      <Text style={styles.text}>Chef au rapport : {user?.nom}</Text>
      <TouchableOpacity  onPress={handleLogout} style={styles.button}>
        <Text style={styles.buttonText}>Déconnexion</Text>
      </TouchableOpacity >
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 20 }
});