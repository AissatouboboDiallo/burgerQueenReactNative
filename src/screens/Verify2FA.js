import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice'; // Assurez-vous que le chemin est correct

export default function Verify2FAScreen({ route }) {
  const { uid } = route.params; // On récupère l'UID envoyé par l'écran précédent
  const [codeEntre, setCodeEntre] = useState('');
  const dispatch = useDispatch();

  const handleVerify = async () => {
    if (codeEntre.length !== 6) {
      Alert.alert("Erreur", "Le code doit contenir 6 chiffres.");
      return;
    }

    try {
      // 1. On va chercher les données fraîches de l'utilisateur dans Firestore
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const info2FA = userData.temporary2FA;

        // 2. Est-ce que le code correspond ?
        if (!info2FA || info2FA.code !== codeEntre) {
          Alert.alert("Échec", "Le code entré est incorrect.");
          return;
        }

        // 3. Est-ce que le code a expiré ?
        const maintenant = new Date();
        const dateExpiration = new Date(info2FA.expiresAt);
        if (maintenant > dateExpiration) {
          Alert.alert("Échec", "Ce code a expiré. Veuillez vous reconnecter.");
          return;
        }

        // 4. Le code est bon ! On le nettoie dans Firestore pour la sécurité
        await updateDoc(userDocRef, { temporary2FA: null });

        // 5. On déclenche l'action Redux pour connecter l'utilisateur
        const loggedInUser = {
          uid: uid,
          email: userData.email,
          nom: userData.nom,
          role: userData.role, // "cuisinier", "manager", etc.
        };
        
        dispatch(login(loggedInUser)); // Redux va changer l'état global et l'appli va rediriger vers le Dashboard !

      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de vérifier le code.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sécurité renforcée 🔒</Text>
      <Text style={styles.subtitle}>Un code de vérification à 6 chiffres a été envoyé sur votre adresse email.</Text>
      
      <TextInput
        style={styles.input}
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
        value={codeEntre}
        onChangeText={setCodeEntre}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Valider et Entrer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, fontSize: 24, textAlign: 'center', letterSpacing: 5, marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }
});