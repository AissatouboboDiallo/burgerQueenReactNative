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
    runTransaction,
    getDocs,
} from 'firebase/firestore';
import { recalculerDisponibiliteTousProduits } from './produitsServices';

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

    if (updates.status === 'prete') {
        const nouvellesRuptures = await decrementerStockEtValider(commandeRef, updates);
        await recalculerDisponibiliteTousProduits();

        // Ici, plus tard : déclencher la notification manager pour chaque ingrédient en nouvelles_ruptures
        if (nouvellesRuptures.length > 0) {
            console.log('Ingrédients venant de passer en rupture :', nouvellesRuptures);
        }
    } else {
        await updateDoc(commandeRef, { ...updates, updatedAt: serverTimestamp() });
    }
};

// Décrémente le stock des ingrédients concernés par cette commande, de façon atomique
const decrementerStockEtValider = async (commandeRef, updates) => {
    let nouvellesRuptures =[];
    await runTransaction(db, async (transaction) => {
        const commandeSnap = await transaction.get(commandeRef);
        if (!commandeSnap.exists()) throw new Error('Commande introuvable.');

        const commande = commandeSnap.data();

        // Sécurité : si le stock a déjà été décrémenté pour cette commande, on ne recommence pas
        if (commande.stockDecremente) {
            transaction.update(commandeRef, { ...updates, updatedAt: serverTimestamp() });
            return;
        }

        // 1. Récupère tous les produits distincts de la commande
        const produitIds = [...new Set(commande.plats.map((p) => p.produitId))];
        const produitRefs = produitIds.map((id) => doc(db, 'produits', id));
        const produitSnaps = await Promise.all(produitRefs.map((ref) => transaction.get(ref)));

        // 2. Calcule la quantité totale à retirer, ingrédient par ingrédient
        const decrements = {}; // { ingredientId: quantiteTotaleARetirer }

        produitSnaps.forEach((snap, index) => {
            if (!snap.exists()) return;
            const produit = snap.data();
            const plat = commande.plats.find((p) => p.produitId === produitIds[index]);
            const nbre = plat ? plat.nbre : 0;

            (produit.recette || []).forEach((r) => {
                const totalARetirer = r.quantiteUtilisee * nbre;
                decrements[r.ingredientId] = (decrements[r.ingredientId] || 0) + totalARetirer;
            });
        });

        // 3. Lit tous les ingrédients concernés et calcule leur nouvelle quantité
        const ingredientIds = Object.keys(decrements);
        const ingredientRefs = ingredientIds.map((id) => doc(db, 'ingredients', id));
        const ingredientSnaps = await Promise.all(ingredientRefs.map((ref) => transaction.get(ref)));

        ingredientSnaps.forEach((snap, index) => {
            if (!snap.exists()) return;
            const ingredient = snap.data();
            const nouvelleQuantite = Math.max(0, ingredient.quantiteActuelle - decrements[ingredientIds[index]]);
            const seuil = ingredient.seuilAlerte || 0;
            const enRupture = nouvelleQuantite <= seuil;

            if (enRupture && !ingredient.enRupture) {
                nouvellesRuptures.push({ id: ingredientIds[index], nom: ingredient.nom });
            }

            transaction.update(ingredientRefs[index], { quantiteActuelle: nouvelleQuantite, enRupture });
        });

        transaction.update(commandeRef, { ...updates, updatedAt: serverTimestamp(), stockDecremente: true });
    });
     return nouvellesRuptures;   // ✅ retourné proprement, après la transaction

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