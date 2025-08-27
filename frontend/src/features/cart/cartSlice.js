import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/AxiosAPI'; // Axios instance with token interceptor

// --- Async Thunks ---

export const fetchUserCart = createAsyncThunk(
  'cart/fetchUserCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/cart'); // token auto-injected by interceptor
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (newItem, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/cart', newItem);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/cart/${cartItemId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- Slice ---

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload || [];
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Item
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
      })
      // Remove Item
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload || [];
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
