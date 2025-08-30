import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  page: 1,
  pages: 1,
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // --- Product List ---
    productListRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    productListSuccess: (state, action) => {
      state.loading = false;
      state.products = Array.isArray(action.payload.products)
        ? action.payload.products
        : [];
      state.page = action.payload.page;
      state.pages = action.payload.pages;
    },
    productListFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- Product Details ---
    productDetailsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    productDetailsSuccess: (state, action) => {
      state.loading = false;
      state.product = action.payload;
    },
    productDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  productListRequest,
  productListSuccess,
  productListFail,
  productDetailsRequest,
  productDetailsSuccess,
  productDetailsFail,
} = productSlice.actions;

export default productSlice.reducer;
