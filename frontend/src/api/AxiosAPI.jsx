import axios from 'axios';
import { store } from '../app/store';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  // The baseURL is now dynamic.
  // In production: 'https://rely-tailors-backend.onrender.com/api'
  // In development: '/api' (which works with the proxy)
  baseURL: `${API_URL}/api`,
});

// This is an interceptor. It runs before each request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the user info from the Redux store
    const { userInfo } = store.getState().auth;

    if (userInfo && userInfo.token) {
      // If the user is logged in, add the token to the headers
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
