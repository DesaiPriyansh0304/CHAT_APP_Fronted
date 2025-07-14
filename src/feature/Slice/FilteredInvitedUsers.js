import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_REACT_APP;

export const fetchFilteredInvitedUsers = createAsyncThunk(
  "filteredInvitedUsers/fetch",
  async ({ filter, searchQuery }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Authtoken");

      if (!token) {
        return rejectWithValue(
          "❌No token found. Please login again./CreateGroup"
        );
      }

      const response = await axios.post(
        `${URL}/api/auth/get-filteruser`,
        { filter, searchQuery },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log('✅response --->/filterinvitedUser', response);

      return response.data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const filteredInvitedUsersSlice = createSlice({
  name: "filteredInvitedUsers",
  initialState: {
    users: [],
    loading: false,
    error: null,
    currentFilter: "verify",
    searchQuery: "",
  },
  reducers: {
    setFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredInvitedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredInvitedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchFilteredInvitedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch invited users";
      });
  },
});

export const { setFilter, setSearchQuery } = filteredInvitedUsersSlice.actions;
export default filteredInvitedUsersSlice.reducer;
