import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_REACT_APP;

export const fetchUserGroups = createAsyncThunk(
  "groups/fetchUserGroups",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("Authtoken");

      const res = await axios.get(`${URL}/api/group/usergroups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.groups;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// ✅ Slice
const userGroupsSlice = createSlice({
  name: "userGroups",
  initialState: {
    groups: [],
    loading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchUserGroups.rejected, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
        state.error = action.payload;
      });
  },
});

export const { addGroup } = userGroupsSlice.actions;
export default userGroupsSlice.reducer;
