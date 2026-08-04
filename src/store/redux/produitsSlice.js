// redux/produitSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addProduit, updateProduit, deleteProduit } from '../../services/produitsServices';

// Thunk = une action asynchrone (car parler à Firestore prend du temps)
export const createProduit = createAsyncThunk(
    'produits/create',
    async (produitData) => {
        const id = await addProduit(produitData);
        return { id, ...produitData };
    }
);

export const editProduit = createAsyncThunk(
    'produits/edit',
    async ({ id, updates }) => {
        await updateProduit(id, updates);
        return { id, updates };
    }
);

export const removeProduit = createAsyncThunk(
    'produits/delete',
    async (produitId) => {
        await deleteProduit(produitId);
        return produitId;
    }
);

const produitSlice = createSlice({
    name: 'produits',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Cette action normale (pas un thunk) reçoit la liste envoyée par onSnapshot
        setProduitsRealtime: (state, action) => {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProduit.fulfilled, (state, action) => {
                // Pas besoin de push manuellement ici : onSnapshot va s'en charger automatiquement
                // On laisse ce case vide ou juste pour du logging/debug
            })
            .addCase(editProduit.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(removeProduit.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export const { setProduitsRealtime } = produitSlice.actions;
export default produitSlice.reducer;