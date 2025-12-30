import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {ThemeProvider} from "./context/ThemeContext.jsx";
import App from './App';
import authReducer from './redux/authSlice';
import cartReducer from './redux/cartSlice';
import '../index.css'


const token = localStorage.getItem('token');
const refreshToken = localStorage.getItem('refreshToken');
let user = null;

try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        user = JSON.parse(storedUser);
    }
} catch (error) {
    console.error("Failed to parse user from localStorage", error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
}

const preloadedState = {
    auth: {
        user: user,
        token: token,
        refreshToken : refreshToken,
        isAuthenticated: !!user && !!token,
    },
};

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
    },
    preloadedState,
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);