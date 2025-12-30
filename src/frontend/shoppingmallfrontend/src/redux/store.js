import {configureStore} from '@reduxjs/toolkit';
import themeReducer from './themeSlice.js';
import authReducer from './authSlice.js'
import cartReducer from './cartSlice.js'

export const store = configureStore({
    reducer : {
        theme : themeReducer,
        auth: authReducer,
        cart: cartReducer,
    }
});
