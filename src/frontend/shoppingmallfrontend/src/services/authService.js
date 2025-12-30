import api from '../services/api.js/';

const register = async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
}

const login = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
}

const authService = {
    register,
    login,
};

export default authService;
