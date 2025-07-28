import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const fetchInvitedUsers = createAsyncThunk(
  "invitedUsers/fetchInvitedUsers",
  async (searchQuery = "", { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Authtoken");

      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP
        }/api/auth/userdata/get-inviteduser?search=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch invited users");
      }

      return {
        invitedUsers: data.data.invitedUsers || [],
        invitedBy: data.data.invitedBy || [],
      };
    } catch (error) {
      console.error("fetchInvitedUsers error:", error);
      return rejectWithValue("Network error");
    }
  }
);

const invitedUsersSlice = createSlice({
  name: "invitedUsers",
  initialState: {
    invitedUsers: [],
    invitedBy: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can add filtering/resetting reducers here if needed
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
      })
      .addCase(fetchInvitedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export default invitedUsersSlice.reducer;
