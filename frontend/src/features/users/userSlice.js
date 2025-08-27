import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/AxiosAPI';

// --- Fetch all users ---
export const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/users');
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// --- Delete a user ---
export const deleteUser = createAsyncThunk(
    'users/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/users/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// --- Update user role ---
export const updateUserRole = createAsyncThunk(
    'users/updateRole',
    async ({ id, role }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/admin/users/${id}`, { role });
            return data; // returns updated user object
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

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
            // --- Fetch Users ---
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // --- Delete User ---
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.payload;
            })

            // --- Update User Role ---
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.users = state.users.map(user =>
                    user._id === action.payload._id ? action.payload : user
                );
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default userSlice.reducer;
