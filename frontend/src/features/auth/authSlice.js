import { createSlice } from '@reduxjs/toolkit';

// Check for user info in local storage to persist login state
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
    // Reducer for when a login/register request starts
    authRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Reducer for when login/register is successful
    authSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      // Save user info to local storage
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // Reducer for when login/register fails
    authFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Reducer for logging out
    logout: (state) => {
      state.userInfo = null;
      // Remove user info from local storage
      localStorage.removeItem('userInfo');
    },
  },
});

// Export the actions so we can use them in our components
export const { authRequest, authSuccess, authFail, logout } = authSlice.actions;

export default authSlice.reducer;
