import React, { useState } from 'react';
import {StyleSheet, View, TextInput, Button, Text,TouchableOpacity,KeyboardAvoidingView,Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Alert } from 'react-native';
import {useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';


// 2 . Importation des configurations Firebase et des fonctions d'authentification
import { auth , db } from '../../firebaseConfig';
import { signInWithEmailAndPassword , createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuthActions } from '../store/useAuthActions'; // Importer le hook personnalisé


export default function LoginScreen() {
  
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Pour afficher un chargement
    // 2. État pour suivre l'onglet actif : 'connexion' ou 'inscription'
  const [activeTab, setActiveTab] = useState('connexion');
  const [nom, setNom] = useState(''); // Nouveau champ pour l'inscription

  const dispatch = useDispatch();
  const {getFirebaseErrorMessage} = useAuthActions()

 const handleChangeNom = (value) => {
    // Autorise uniquement les lettres (avec accents), espaces, tirets et apostrophes
    const filtered = value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '');
    setNom(filtered);
}; 

const handleLogin = async () => {

        // Validation des champs
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        setLoading(true); // Commence le chargement

        try {
            // Étape A : Authentification auprès du coffre-fort Firebase
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                  
                // Étape B : Recherche du rôle dans la collection Firestore "users" grâce à l'UID
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();

                // Étape C : On stocke l'utilisateur complet dans Redux
                const loggedInUser = {
                uid: user.uid,
                email: user.email,
                nom: userData.nom,
                role: userData.role, // 'manager' ou 'cuisinier'
                };

                dispatch(login(loggedInUser));                
                // C'est ici que la navigation prendra le relais plus tard pour changer d'écran !
            } else {
                Alert.alert('Erreur', "Profil utilisateur introuvable dans la base de données.");
            }

   } catch (error) {
        const message = getFirebaseErrorMessage(error.code);
       Alert.alert('Erreur d\'inscription', message);
    } finally {
        setLoading(false); // Arrête le chargement
    }
};

const handleRegister = async () => {
    if (!nom || !email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs pour l\'inscription.');
      return;
    }
    const nomValide = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/.test(nom.trim());
    if (!nomValide) {
        Alert.alert('Nom invalide', 'Le nom doit contenir entre 2 et 50 lettres, sans chiffres ni caractères spéciaux.');
        return;
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères.');
      setLoading(false);
      return;
    }

    setLoading(true);

    try { 
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Après la création de l'utilisateur, on ajoute ses informations dans Firestore
        await setDoc(doc(db, 'users', user.uid), {
            nom: nom,
            email: email,
            role: 'manager', // Par défaut, on attribue le rôle de cuisinier
            createdAt: new Date().toISOString() // On peut aussi stocker la date de création
        });

        Alert.alert('Succès', 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        setNom('');
        setEmail('');
        setPassword('');
        setActiveTab('connexion'); // On bascule automatiquement sur l'onglet connexion après l'inscription

    } catch (error) {
        const message = getFirebaseErrorMessage(error.code);
        Alert.alert('Erreur d\'inscription', message);
    } finally {
        setLoading(false);
    }


  };


return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner} // <-- Correction ici : application du style inner pour le centrage
      >
        {/* Logo Couronne */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Text style={styles.logoEmoji}>
             <MaterialCommunityIcons name="crown-outline" size={60} />
              
            </Text>
          </View>
          <Text style={styles.title}>
            Burger <Text style={styles.titleHighlight}>Queen</Text>
          </Text>
          <Text style={styles.subtitle}>Le tableau de bord de votre restaurant</Text>
        </View>

        {/* Onglets Connexion / Inscription dynamiques */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'connexion' && styles.activeTab]}
            onPress={() => setActiveTab('connexion')}
          >
            <Text style={activeTab === 'connexion' ? styles.activeTabText : styles.tabText}>
              Connexion
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'inscription' && styles.activeTab]}
            onPress={() => setActiveTab('inscription')}
          >
            <Text style={activeTab === 'inscription' ? styles.activeTabText : styles.tabText}>
              Inscription
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulaire Dynamique */}
        <View style={styles.form}>
          
          {/* CHAMP NOM (Affiché UNIQUEMENT si l'onglet Inscription est sélectionné) */}
          {activeTab === 'inscription' && (
            <>
              <Text style={styles.label}>NOM COMPLET</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Jean Dupont"
                  placeholderTextColor="#9CA3AF"
                  value={nom}
                  onChangeText={handleChangeNom}
                />
              </View>
            </>
          )}

          {/* CHAMP EMAIL (Commun) */}
          <Text style={styles.label}>EMAIL</Text>
          <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email" size={20} color="black" />
            <TextInput 
              style={styles.input}
              placeholder="nom@restaurant.fr"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          {/* CHAMP MOT DE PASSE (Commun) */}
          <Text style={styles.label}>MOT DE PASSE</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock" size={20} color="black" />
            <TextInput 
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Bouton de validation dynamique (Texte et Action changent selon l'onglet) */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={activeTab === 'connexion' ? handleLogin : handleRegister} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#111827" />
            ) : (
              <Text style={styles.buttonText}>
                {activeTab === 'connexion' ? 'Se connecter →' : "Créer le compte →"}
              </Text>
            )}
          </TouchableOpacity>     

          {/* Footer interactif qui permet aussi de basculer d'onglet */}
          <TouchableOpacity onPress={() => setActiveTab(activeTab === 'connexion' ? 'inscription' : 'connexion')}>
            <Text style={[styles.footerText, { textAlign: 'center' }]}>
              {activeTab === 'connexion' ? (
                <>Nouveau dans l'équipe ? <Text style={styles.footerLink}>Créer un compte</Text></>
              ) : (
                <>Déjà membre ? <Text style={styles.footerLink}>Se connecter</Text></>
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Assure que le contenu prend toute la largeur disponible
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBackground: {
    width: 100,
    height: 100,
    backgroundColor: '#F59E0B',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  logoEmoji: { // Correction de la typo lofoEmoji -> logoEmoji
    fontSize: 45,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },
  titleHighlight: {
    color: '#F59E0B',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 4,
    marginBottom: 32,
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activeTabText: {
    fontWeight: '700',
    color: '#111827',
  },
  tabText: {
    fontWeight: '600',
    color: '#6B7280',
  },
  form: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 56,
    gap:10
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#9CA3AF',
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#F59E0B',
    borderRadius: 24,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 16,
  },
  footerLink: {
    fontWeight: '700',
    color: '#111827',
  },
});