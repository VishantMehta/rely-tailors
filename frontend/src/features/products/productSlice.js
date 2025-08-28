import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  loading: false,
  error: null,
  page: 1,
  pages: 1,
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    productListRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    productListSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.products; // new API response
      state.page = action.payload.page;
      state.pages = action.payload.pages;
    },
    productListFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { productListRequest, productListSuccess, productListFail } = productSlice.actions;
export default productSlice.reducer;
