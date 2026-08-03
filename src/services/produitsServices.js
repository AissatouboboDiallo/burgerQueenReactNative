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
    getDocs
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

// Recalcule "disponible" pour TOUS les produits, selon le stock actuel des ingrédients
export const recalculerDisponibiliteTousProduits = async () => {
    const ingredientsSnap = await getDocs(collection(db, 'ingredients'));
    const ingredients = ingredientsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const produitsSnap = await getDocs(collection(db, 'produits'));

    const misesAJour = [];
    produitsSnap.forEach((docSnap) => {
        const produit = docSnap.data();
        const recette = produit.recette || [];

        const disponible = recette.every((r) => {
            const ingredient = ingredients.find((i) => i.id === r.ingredientId);
            return ingredient && ingredient.quantiteActuelle >= r.quantiteUtilisee;
        });

        if (produit.disponible !== disponible) {
            misesAJour.push(updateDoc(doc(db, 'produits', docSnap.id), { disponible }));
        }
    });

    await Promise.all(misesAJour);
};

// DELETE — supprimer un produit
export const deleteProduit = async (produitId) => {
    const produitRef = doc(db, 'produits', produitId);
    await deleteDoc(produitRef);
};