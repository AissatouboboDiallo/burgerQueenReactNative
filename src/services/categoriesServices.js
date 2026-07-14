// services/CategorieService.js
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

// Référence vers la collection "categories"
const categoriesCollection = collection(db, 'categories');

// CREATE — ajouter un nouveau Categorie
export const addCategorie = async (categorieData) => {
    const docRef = await addDoc(categoriesCollection, {
        ...categorieData,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

// READ — écoute en temps réel (à chaque changement dans Firestore, callback est rappelé)
export const subscribeTocategories = (callback) => {
    return onSnapshot(categoriesCollection, (snapshot) => {
        const categories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toMillis() || null ,

        }));
        callback(categories);
    });
};

// UPDATE — modifier un categories existant
export const updatecategories = async (categoriesId, updates) => {
    const categoriesRef = doc(db, 'categories', categoriesId);
    await updateDoc(categoriesRef, updates);
};

// DELETE — supprimer un categories
export const deletecategories = async (categoriesId) => {
    const categoriesRef = doc(db, 'categories', categoriesId);
    await deleteDoc(categoriesRef);
};