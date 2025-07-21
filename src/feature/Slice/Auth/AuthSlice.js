import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('Authtoken');

const initialState = {
  token: token || null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called on successful login
    addToken: (state, action) => {
      const { token } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('Authtoken', token);
    },
    // Logout
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('Authtoken');
    },
    // Force set isAuthenticated (if needed)
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { addToken, logout, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
