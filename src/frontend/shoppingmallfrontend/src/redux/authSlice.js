import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    refreshToken : null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.userDTO;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;


            localStorage.setItem('user', JSON.stringify(action.payload.userDTO));
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        },

        registrationSuccess: (state, action) => {
            state.user = action.payload.userDTO;
            state.token = action.payload.token;
            state.isAuthenticated = true;

            localStorage.setItem('user', JSON.stringify(action.payload.userDTO));
            localStorage.setItem('token', action.payload.token);
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;

            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },

        updateUserInfo: (state, action) => {
            if(state.user) {
                state.user = {...state.user, ...action.payload}
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        },


        updateAccessToken: (state, action) => {
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
        },

    },
});

export const { loginSuccess, registrationSuccess, logout , updateUserInfo, updateAccessToken} = authSlice.actions;
export default authSlice.reducer;