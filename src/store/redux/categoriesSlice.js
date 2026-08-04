// redux/produitSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addCategorie, updatecategories, subscribeTocategories,deletecategories } from '../../services/categoriesServices';
// Thunk = une action asynchrone (car parler à Firestore prend du temps)
export const createCategorie = createAsyncThunk(
    'categories/create',
    async (categorieData) => {
        const id = await addCategorie(categorieData);
        return { id, ...categorieData };
    }
);

export const editCategorie = createAsyncThunk(
    'categories/edit',
    async ({ id, updates }) => {
        await updateCategorie(id, updates);
        return { id, updates };
    }
);

export const removeCategorie = createAsyncThunk(
    'categories/delete',
    async (categorieId) => {
        await deleteCategorie(categorieId);
        return categorieId;
    }
);

const CategorieSlice = createSlice({
    name: 'categories',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Cette action normale (pas un thunk) reçoit la liste envoyée par onSnapshot
        setCategoriesRealtime: (state, action) => {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCategorie.fulfilled, (state, action) => {
                // Pas besoin de push manuellement ici : onSnapshot va s'en charger automatiquement
                // On laisse ce case vide ou juste pour du logging/debug
            })
            .addCase(editCategorie.rejected, (state, action) => {
                state.error = action.error.message;
            })
            .addCase(removeCategorie.rejected, (state, action) => {
                state.error = action.error.message;
            });
    },
});

export const { setCategoriesRealtime } = CategorieSlice.actions;
export default CategorieSlice.reducer;