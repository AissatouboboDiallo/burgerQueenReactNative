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
const ingredientsCollection = collection(db, 'ingredients');

// CREATE — ajouter un nouveau Ingredient
export const addIngredient = async (ingredientData) => {
    const docRef = await addDoc(ingredientsCollection, {
        ...ingredientData,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

// READ — écoute en temps réel (à chaque changement dans Firestore, callback est rappelé)
export const subscribeToIngredients = (callback) => {
    return onSnapshot(ingredientsCollection, (snapshot) => {
        const ingredients = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toMillis() || null ,

        }));
        callback(ingredients);
    });
};

// UPDATE — modifier un Ingredients existant
export const updateIngredients = async (ingredientId, updates) => {
    const ingredientsRef = doc(db, 'Ingredients', ingredientId);
    await updateDoc(ingredientsRef, updates);
};

// DELETE — supprimer un Ingredients
export const deleteIngredients = async (ingredientId) => {
    const ingredientsRef = doc(db, 'Ingredients', ingredientId);
    await deleteDoc(ingredientsRef);
};