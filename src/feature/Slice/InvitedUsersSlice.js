import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const fetchInvitedUsers = createAsyncThunk(
  "invitedUsers/fetchInvitedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Authtoken");
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP}/api/auth/get-inviteduser`,
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
        invitedUsers: data.invitedUsers || [],
        invitedBy: data.invitedBy || [],
      };
    } catch (error) {
      console.log("error --->", error);
      return rejectWithValue("Network error");
    }
  }
);

const invitedUsersSlice = createSlice({
  name: "invitedUsers",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvitedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvitedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        // state.invitedBy = action.payload.invitedBy;
      })
      .addCase(fetchInvitedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export default invitedUsersSlice.reducer;
