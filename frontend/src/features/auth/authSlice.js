import { createSlice } from '@reduxjs/toolkit';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    authFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    // --- ADD THIS NEW REDUCER ---
    updateUserProfile: (state, action) => {
      // Merge the updated fields into the existing user info
      state.userInfo = { ...state.userInfo, ...action.payload };
      // Save the completely new user info object to local storage
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
  },
});

// Export the new action
export const { authRequest, authSuccess, authFail, logout, updateUserProfile } = authSlice.actions;

export default authSlice.reducer;
