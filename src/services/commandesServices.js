// services/IngredientService.js
import { db } from '../../firebaseConfig';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore';

// Référence vers la collection "Ingredients"
const commandesCollection = collection(db, 'commandes');

// CREATE — ajouter un nouveau Ingredient
export const addCommande = async (commandeData) => {
    const docRef = await addDoc(commandesCollection, {
        ...commandeData,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

// READ — écoute en temps réel (à chaque changement dans Firestore, callback est rappelé)
export const subscribeToCommandes = (callback) => {
    return onSnapshot(commandesCollection, (snapshot) => {
        const commandes = snapshot.docs.map((doc) => {
            const data = doc.data(); // ← cette ligne doit être présente !
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt ? data.createdAt.toMillis() : null,
                updatedAt: data.updatedAt ? data.updatedAt.toMillis() : null,


            };
        });
        callback(commandes);
    });
};

// UPDATE — modifier un Commandes existant
export const updateCommande = async (commandeId, updates) => {
    const commandeRef = doc(db, 'commandes', commandeId);
    await updateDoc(commandeRef, {
        ...updates,
        updatedAt: serverTimestamp(),   // ⬅️ ajouté ICI uniquement, jamais ailleurs
    });
};

// Search — modifier un Commandes existant
export const searchCommandes = async (commandeId, searchs) => {
    const commandesRef = await doc(db, 'commandes', commandeId);
    if (!commandesRef) return false
    return true;
};


// DELETE — supprimer un Ingredients
export const deleteCommandes = async (commandeId) => {
    const commandesRef = doc(db, 'commandes', commandeId);
    await deleteDoc(commandesRef);
};