import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_REACT_APP;

// 🔸 DELETE GROUP
export const deleteGroup = createAsyncThunk(
  "group/deleteGroup",
  async (groupId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Authtoken");
      const res = await axios.post(
        `${URL}/api/group/deletegroup`,
        { groupId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// 🔸 LEAVE GROUP
export const leaveGroup = createAsyncThunk(
  "group/leaveGroup",
  async (groupId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Authtoken");
      const res = await axios.post(
        `${URL}/api/group/leavegroup`,
        { groupId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// 🔸 REDUCER SLICE
const groupActionSlice = createSlice({
  name: "groupAction",
  initialState: {
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearGroupState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // DELETE GROUP
      .addCase(deleteGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // LEAVE GROUP
      .addCase(leaveGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(leaveGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearGroupState } = groupActionSlice.actions;
export default groupActionSlice.reducer;
