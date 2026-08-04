// services/authServices.js
import { auth, db } from '../../firebaseConfig';
import { 
    deleteUser, 
    reauthenticateWithCredential, 
    EmailAuthProvider 
} from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { updateDoc } from 'firebase/firestore';



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

// Modifie le nom affiché (côté Auth) + les infos Firestore (nom, role, photoUrl...)
export const updateUserInfo = async (updates) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Aucun utilisateur connecté.');

    // Met à jour le displayName Firebase Auth si le nom change
    if (updates.nom) {
        await updateProfile(user, { displayName: updates.nom });
    }

    // Met à jour le document Firestore avec toutes les infos du profil
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, updates);
};

// Modifie l'email (nécessite ré-authentification récente)
export const updateUserEmail = async (currentPassword, newEmail) => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, newEmail);
};

// Modifie le mot de passe (nécessite aussi ré-authentification)
export const updateUserPassword = async (currentPassword, newPassword) => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
};