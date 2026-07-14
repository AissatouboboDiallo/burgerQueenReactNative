// services/produitService.js
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

// Référence vers la collection "produits"
const produitsCollection = collection(db, 'produits');

// CREATE — ajouter un nouveau produit
export const addProduit = async (produitData) => {
    const docRef = await addDoc(produitsCollection, {
        ...produitData,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

// READ — écoute en temps réel (à chaque changement dans Firestore, callback est rappelé)
export const subscribeToProduits = (callback) => {
    return onSnapshot(produitsCollection, (snapshot) => {
        const produits = snapshot.docs.map((doc) => {
            const data = doc.data(); // ← cette ligne doit être présente !
            return {
                id: doc.id,
                ...data,
               createdAt: doc.data().createdAt?.toMillis() || null ,
            };
        });
        callback(produits);
    });
};

// UPDATE — modifier un produit existant
export const updateProduit = async (produitId, updates) => {
    const produitRef = doc(db, 'produits', produitId);
    await updateDoc(produitRef, updates);
};

// DELETE — supprimer un produit
export const deleteProduit = async (produitId) => {
    const produitRef = doc(db, 'produits', produitId);
    await deleteDoc(produitRef);
};