// redux/produitSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addIngredient,updateIngredient,subscribeToIngredients,deleteIngredient } from '../../services/igredientsServices';


// Thunk = une action asynchrone (car parler à Firestore prend du temps)

export const createIngredient = createAsyncThunk(
    'ingredients/create',
    async (ingredientData) => {
        const id = await addIngredient(ingredientData);
        return { id, ...ingredientData };
    }
);

export const editIngredient = createAsyncThunk(
    'ingredients/edit',
    async ({ id, updates }) => {
        await updateIngredient(id, updates);
        return { id, updates };
    }
);

export const removeIngredient = createAsyncThunk(
    'ingredients/delete',
    async (ingredientId) => {
        await deleteIngredient(ingredientId);
        return ingredientId;
    }
);

const Ingredientslice = createSlice({
    name: 'ingredients',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Cette action normale (pas un thunk) reçoit la liste envoyée par onSnapshot
        setIngredientsRealtime: (state, action) => {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createIngredient.fulfilled, (state, action) => {
                // Pas besoin de push manuellement ici : onSnapshot va s'en charger automatiquement
                // On laisse ce case vide ou juste pour du logging/debug
            })
            .addCase(editIngredient.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(removeIngredient.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export const { setIngredientsRealtime } = Ingredientslice.actions;
export default Ingredientslice.reducer;