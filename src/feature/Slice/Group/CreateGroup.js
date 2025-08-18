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

      console.log("✅res --->/CreateGroup", res);

      // API response: {"status":200,"message":"Group Created Successfully"}
      // આ response માં group data નથી, તો manual group object બનાવીએ
      if (res.data.status === 200) {
        return {
          ...groupData,
          id: Date.now(), // Temporary ID
          createdAt: new Date().toISOString(),
          status: res.data.status,
          message: res.data.message,
        };
      } else {
        return rejectWithValue(res.data.message || "Failed to create group");
      }
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
    createSuccess: false,
  },
  reducers: {
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        state.groups.push(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.createSuccess = false;
      });
  },
});

export const { clearCreateSuccess, clearError } = groupSlice.actions;
export default groupSlice.reducer;
