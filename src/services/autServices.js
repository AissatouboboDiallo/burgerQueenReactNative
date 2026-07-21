// services/authServices.js
import { auth, db } from '../../firebaseConfig';
import { 
    deleteUser, 
    reauthenticateWithCredential, 
    EmailAuthProvider 
} from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';


export const deleteUserAccount = async (email, password) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Aucun utilisateur connecté.');

    // Ré-authentification obligatoire avant une suppression
    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(user, credential);

    // Supprime d'abord le document Firestore (profil, rôle, etc.)
    await deleteDoc(doc(db, 'users', user.uid));

    // Puis supprime le compte d'authentification Firebase
    await deleteUser(user);
};