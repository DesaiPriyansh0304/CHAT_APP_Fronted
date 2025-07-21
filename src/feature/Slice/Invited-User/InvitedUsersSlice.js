import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

{
  /*invitedUsers API Call*/
}
export const fetchInvitedUsers = createAsyncThunk(
  'invitedUsers/fetchInvitedUsers',
  async (searchQuery = '', { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Authtoken');
      if (!token) {
        return rejectWithValue('❌No token found. Please login again./invitedUserSlice');
      }
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP}/api/auth/get-inviteduser?search=${searchQuery}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // console.log("✅response --->/invitedUserSlice", response);
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch invited users');
      }

      return {
        invitedUsers: data.invitedUsers || [],
        invitedBy: data.invitedBy || [],
      };
    } catch (error) {
      console.error('error --->/invitedUserSlice', error);
      return rejectWithValue('Network error');
    }
  }
);

const invitedUsersSlice = createSlice({
  name: 'invitedUsers',
  initialState: {
    invitedUsers: [],
    invitedBy: [],
    loading: false,
    error: null,
    isLoaded: false,
  },
  reducers: {
    resetInvitedUsersState: (state) => {
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvitedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvitedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.invitedUsers = action.payload.invitedUsers;
        state.invitedBy = action.payload.invitedBy;
        state.isLoaded = true;
      })
      .addCase(fetchInvitedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoaded = false;
        toast.error(action.payload);
      });
  },
});

export const { resetInvitedUsersState } = invitedUsersSlice.actions;
export default invitedUsersSlice.reducer;
