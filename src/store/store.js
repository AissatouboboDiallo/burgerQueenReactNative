import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice'; 
import produitsReducer from '../store/redux/produitsSlice'
import categorieReducer from '../store/redux/categoriesSlice'
import ingredientReducer from '../store/redux/ingredientsSlice'
import commandeReducer from '../store/redux/commandesSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    produits:produitsReducer,
    categories:categorieReducer ,
    ingredients:ingredientReducer,
    commandes:commandeReducer,
  },
});