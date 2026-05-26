import axios from 'axios';

const api = axios.create({
    baseURL :  'http://13.203.98.195:8000',
});


//attach JWT token to every request autmatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;