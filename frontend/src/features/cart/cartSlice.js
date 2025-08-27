import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/AxiosAPI'; // Your configured Axios instance

// --- Async Thunks for API Calls ---

export const fetchUserCart = createAsyncThunk(
  'cart/fetchUserCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/cart');
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
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
      return rejectWithValue(error.response.data.message);
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
      return rejectWithValue(error.response.data.message);
    }
  }
);

// --- Cart Slice Definition ---

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
        state.cartItems = action.payload;
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Item
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload; // The API returns the full updated cart
      })
      // Remove Item
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload; // The API returns the full updated cart
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
