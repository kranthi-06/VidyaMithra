import api from './api';

export const login = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const response = await api.post('/login/access-token', formData);
    return response.data;
};

export const register = async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/users/me');
    return response.data;
};
