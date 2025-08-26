import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
    loading: false,
    error: null,
};

export const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        orderListRequest: (state) => {
            state.loading = true;
        },
        orderListSuccess: (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        },
        orderListFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { orderListRequest, orderListSuccess, orderListFail } = orderSlice.actions;

export default orderSlice.reducer;
