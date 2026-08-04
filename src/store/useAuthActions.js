import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import {logout , updateUser} from './authSlice';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {doc,updateDoc} from 'firebase/firestore';
import {auth, db } from '../../firebaseConfig';
import { deleteUserAccount } from '../services/autServices';
import { updateUserInfo } from '../services/autServices';
import { updateUserEmail } from '../services/autServices';
import { updateUserPassword } from '../services/autServices';



export function useAuthActions() {
  const dispatch = useDispatch();

      // 1. Fonction pour générer un code à 6 chiffres
const generate2FACode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const handleLogin = async (email, password) => {
  try {
    // 2. Vérification Firebase classique
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 3. Génération du code (Correction de l'appel ici : generate2FACode)
    const code = generate2FACode(); 
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // 4. Utilisation de setDoc avec merge: true pour éviter les crashs si le doc est tout neuf
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      temporary2FA: { code, expiresAt }
    }, { merge: true });
     
    try {
      // 5. Envoi du vrai email via EmailJS (Tes identifiants ont l'air super propres !)
      await emailjs.send(
        'service_i5s0p2f',   
        'template_zomm3fb',  
        {
          to_email: user.email,
          code_2fa: code,     
        },
        'V40U4XNnKliKoxrjH'    
      );
    }
    catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email :", emailError);
      alert("Impossible d'envoyer le code par email. Veuillez réessayer.");
      return; // On arrête tout si l'email ne part pas
    }

    try { 
    // 6. Navigation vers l'écran de saisie du code
    navigation.navigate('Verify2FA', { uid: user.uid });
    }catch (navigationError) {
      console.error("Erreur de navigation :", navigationError);
      alert("Impossible de naviguer vers l'écran de vérification. Veuillez réessayer.");
    }

  } catch (error) {
    console.error(error);
    alert("Identifiants incorrects ou problème de connexion : " + error.message);
  }
};

const handleVerifyCode = async (uid, codeEntreParLUtilisateur) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const info2FA = userData.temporary2FA;

      // 1. Vérifier si le code existe et correspond
      if (!info2FA || info2FA.code !== codeEntreParLUtilisateur) {
        alert("Code incorrect !");
        return;
      }

      // 2. Vérifier si le code a expiré
      const maintenant = new Date();
      const dateExpiration = new Date(info2FA.expiresAt);
      if (maintenant > dateExpiration) {
        alert("Le code a expiré (limite de 5 minutes) !");
        return;
      }

      // 3. C'est tout bon ! On efface le code pour qu'il ne soit plus réutilisable
      await updateDoc(userDocRef, {
        temporary2FA: null
      });

      // 4. On connecte enfin l'utilisateur dans Redux
      const loggedInUser = { 
        uid: uid, 
        email: userData.email, 
        nom: userData.nom, 
        role: userData.role 
      };
      dispatch(login(loggedInUser)); // Redirection automatique vers le Dashboard !

    }
  } catch (error) {
    console.error(error);
  }
};

 const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'Cette adresse e-mail est déjà utilisée par un autre compte.';
        case 'auth/invalid-email':
            return "L'adresse e-mail saisie n'est pas valide.";
        case 'auth/weak-password':
            return 'Le mot de passe doit contenir au moins 6 caractères.';
        case 'auth/operation-not-allowed':
            return "L'inscription par e-mail/mot de passe n'est pas activée. Contacte l'administrateur.";
        case 'auth/network-request-failed':
            return 'Problème de connexion internet. Vérifie ta connexion et réessaie.';
        case 'auth/too-many-requests':
            return 'Trop de tentatives. Merci de patienter quelques minutes avant de réessayer.';
        case 'auth/internal-error':
            return "Une erreur interne est survenue. Réessaie dans un instant.";
        case 'auth/wrong-password':
          return "Le mot de passe saisie est incorrect "
        case 'auth/invalid-credential':
           return "Le mot de passe saisie est incorrect "         
        default:
            return "Une erreur inattendue est survenue . Réessaie.";
    }
}; 


const handleDeleteAccount = async (email, password) => {
   
                    try {
                        await deleteUserAccount(email, password);
                        Alert.alert('Compte supprimé avec succès.');
                        // rediriger vers l'écran de connexion
                        dispatch(logout())
                    } catch (error) {
                        const message = getFirebaseErrorMessage(error.code);
                        Alert.alert('Erreur', message);
                    }
                
};

const handleModifInfoUser = async (newEmail, nom,password) => {
   
try {
  const updates={
    nom:nom,
  }
  await updateUserInfo(updates) ;
  await updateUserEmail(password,newEmail) ;
  dispatch(updateUser({ nom:nom, email:newEmail }));
  Alert.alert("Modification de profil réussi ")
  
} catch (error) {
  const message = getFirebaseErrorMessage(error.code)
  Alert.alert('Erreur',message)

  
}


                
};

const handleModifMotPass = async (currentPassword, newPassword) => {
   
try {

  await updateUserPassword(currentPassword,newPassword) ;
  Alert.alert("Modification de mot de pass réussi ")
  
} catch (error) {
  const message = getFirebaseErrorMessage(error.code)
  Alert.alert('Erreur',message)

  
}


                
};

 const handleChangeNom = (value) => {
    // Autorise uniquement les lettres (avec accents), espaces, tirets et apostrophes
    const filtered = value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '');
    return filtered;
};
const roleFormat =(user) =>  ( 
  user?.role 
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
    : '?'
)

  // On retourne la fonction pour que les composants puissent l'utiliser
  return {handleLogin, handleVerifyCode, getFirebaseErrorMessage, handleDeleteAccount,handleModifInfoUser, handleModifMotPass, handleChangeNom, roleFormat };

}