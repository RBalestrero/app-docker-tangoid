import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error('Falta definir VITE_API_URL en el archivo .env');
}

const axiosClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;