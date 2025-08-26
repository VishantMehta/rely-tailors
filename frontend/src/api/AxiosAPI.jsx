import axios from 'axios';
import { store } from '../app/store'; // We need to get the store to access state

const api = axios.create({
  baseURL: '/api', // Your backend's base URL
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
