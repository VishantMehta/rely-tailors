import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/AxiosAPI';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/admin/users');
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

export const deleteUser = createAsyncThunk('users/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/admin/users/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const initialState = {
    users: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user._id !== action.payload);
            });
    },
});

export default userSlice.reducer;
