import axios from 'axios';
import { store } from '../redux/store';
import { logout, updateAccessToken } from '../redux/authSlice';

const api = axios.create({
    baseURL : 'http://localhost:8080',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post('http://localhost:8080/api/auth/refresh', { refreshToken });
                    const newToken = response.data.token;

                    store.dispatch(updateAccessToken({ token: newToken }));

                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    store.dispatch(logout());
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                store.dispatch(logout());
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);


export default api;