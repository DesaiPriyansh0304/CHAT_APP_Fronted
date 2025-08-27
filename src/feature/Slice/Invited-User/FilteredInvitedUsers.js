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
          "No token found. Please login again./Filter Invited Data"
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
      // console.log('response --->/filterinvitedUser', response);

      const users = response.data.users || [];
      // console.log('Payload received:', { filter, users });

      return { filter, users };
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
    users: {},
    loading: false,
    error: null,
    currentFilter: "verify",
    searchQuery: "",
    fetchedFilters: {
      verify: false,
      unverify: false,
      pending: false,
    },
  },
  reducers: {
    setFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    resetFetchedFilter: (state, action) => {
      const filter = action.payload;
      state.fetchedFilters[filter] = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredInvitedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredInvitedUsers.fulfilled, (state, action) => {
        const { filter, users } = action.payload;
        // console.log(' FULFILLED PAYLOAD:', action.payload);
        state.users[filter] = users;
        state.fetchedFilters[filter] = true;
        state.loading = false;

        // console.log('SETTING users[filter]:', filter, users);
      })
      .addCase(fetchFilteredInvitedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch invited users";
      });
  },
});

export const { setFilter, setSearchQuery, resetFetchedFilter } =
  filteredInvitedUsersSlice.actions;
export default filteredInvitedUsersSlice.reducer;
