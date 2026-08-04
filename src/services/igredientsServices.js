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
    getDocs,
} from 'firebase/firestore';
import { recalculerDisponibiliteTousProduits } from './produitsServices';

// Référence vers la collection "Ingredients"
const ingredientsCollection = collection(db, 'ingredients');

// CREATE — ajouter un nouveau Ingredient
export const addIngredient = async (ingredientData) => {
    const docRef = await addDoc(ingredientsCollection, {
        ...ingredientData,
        createdAt: serverTimestamp(),
    });
    // 🔧 Un nouvel ingrédient peut débloquer un produit qui en avait besoin
    await recalculerDisponibiliteTousProduits();

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
export const updateIngredient = async (ingredientId, updates) => {
    const ingredientsRef = doc(db, 'ingredients', ingredientId);
    await updateDoc(ingredientsRef, updates);
     // 🔧 Si la quantité vient d'être réhaussée (ou baissée), on revérifie tous les produits concernés
    if ('quantiteActuelle' in updates) {
        await recalculerDisponibiliteTousProduits();
    }
    
};

// DELETE — supprimer un Ingredients
export const deleteIngredient = async (ingredientId) => {
    const ingredientsRef = doc(db, 'ingredients', ingredientId);
    await deleteDoc(ingredientsRef);
    // 🔧 Un ingrédient supprimé peut rendre certains produits indisponibles
    await recalculerDisponibiliteTousProduits();
};