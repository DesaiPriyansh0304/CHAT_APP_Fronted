import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_REACT_APP;

export const createGroup = createAsyncThunk(
  "group/create",
  async (groupData, { rejectWithValue }) => {
    const token = localStorage.getItem("Authtoken");

    if (!token) {
      return rejectWithValue(
        "❌No token found. Please login again./CreateGroup"
      );
    }

    try {
      const res = await axios.post(`${URL}/api/group/creategroup`, groupData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("✅res --->/CreateGroup", res);
      return res.data.group;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create group"
      );
    }
  }
);

const groupSlice = createSlice({
  name: "group",
  initialState: {
    groups: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.push(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default groupSlice.reducer;
