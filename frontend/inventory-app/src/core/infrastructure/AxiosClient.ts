import axios from 'axios';

const baseURL = 'http://localhost:7299';

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Ha ocurrido un error';
    return Promise.reject(new Error(message));
  }
); 