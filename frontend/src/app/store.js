import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice'; // <-- 1. Add this import
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
});
