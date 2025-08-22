import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
//Auth slice
import { logout, setAuthenticated } from "./AuthSlice";

const URL = import.meta.env.VITE_REACT_APP;

export const fetchLoginUser = createAsyncThunk(
  "user/fetchLoginUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Authtoken");
      // console.log("token --->/LoginUserDataSlice", token);
      if (!token) {
        dispatch(logout());
        return rejectWithValue("Token not found-Login userSlice");
      }

      const response = await axios.get(`${URL}/api/auth/userdata/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("response --->/LoginUserDataSlice", response);
      // console.log(
      //   "response.data.userData --->/LoginUserDataSlice",
      //   response.data.userData
      // );

      if (response.data && response.data.userData) {
        const userData = {
          ...response.data.userData,
          _id: response.data.userData._id,
        };

        // console.log(
        //   "response.data.userData._id --->/LoginUserDataSlice",
        //   response.data.userData._id
        // );

        dispatch(setAuthenticated(true)); // login success
        return { userData };
      } else {
        dispatch(logout());
        return rejectWithValue("Invalid response from server");
      }
    } catch (error) {
      console.log("error --->LoginUserDataSlice", error);
      dispatch(logout());
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const loginUserSlice = createSlice({
  name: "AuthUser",
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        // console.log("fulfilled reducer called", action.payload.userData);
        state.loading = false;
        state.userData = action.payload.userData;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUserData } = loginUserSlice.actions;
export default loginUserSlice.reducer;
