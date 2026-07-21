// redux/produitSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addCommande , updateCommandes, subscribeToCommandes,deleteCommandes, searchCommandes } from '../../services/commandesServices';
// Thunk = une action asynchrone (car parler à Firestore prend du temps)

export const createCommande = createAsyncThunk(
    'commandes/create',
    async (commandeData) => {
        const id = await addCommande(commandeData);
        return { id, ...commandeData };
    }
);

export const editCommande = createAsyncThunk(
    'commandes/edit',
    async ({ id, updates }) => {
        await updateCommandes(id, updates);
        return { id, updates };
    }
);

export const removeCommande = createAsyncThunk(
    'commandes/delete',
    async (commandeID) => {
        await deleteCommandes(commandeID);
        return commandeID;
    }
);

const Commandeslice = createSlice({
    name: 'commandes',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Cette action normale (pas un thunk) reçoit la liste envoyée par onSnapshot
        setCommandesRealtime: (state, action) => {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCommande.fulfilled, (state, action) => {
                // Pas besoin de push manuellement ici : onSnapshot va s'en charger automatiquement
                // On laisse ce case vide ou juste pour du logging/debug
            })
            .addCase(editCommande.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(removeCommande.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export const { setCommandesRealtime } = Commandeslice.actions;
export default Commandeslice.reducer;