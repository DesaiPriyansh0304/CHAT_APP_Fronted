import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = import.meta.env.VITE_REACT_APP;

export const addFavorite = createAsyncThunk(
  "favorite/addFavorite",
  async ({ messageId, chatType, content, type }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Authtoken");

      if (!token) {
        return rejectWithValue(
          "❌No token found. Please login again./favorite"
        );
      }

      const res = await axios.post(
        `${URL}/api/auth/favorite`,
        { messageId, chatType, content, type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("✅res --->/favorite", res);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetFavoriteState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || "Something went wrong to favorite";
      });
  },
});

export const { resetFavoriteState } = favoriteSlice.actions;
export default favoriteSlice.reducer;
