// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { setAuthenticated, logout } from "./Auth/AuthSlice";

// const URL = import.meta.env.VITE_REACT_APP;
// {
//   /*Login user detail Cheke*/
// }
// export const checkAuth = createAsyncThunk(
//   "auth/checkAuth",
//   async (_, { dispatch, rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("Authtoken");
//       // console.log("ℹ️ token --->/GetUserSlice", token);
//       if (!token) {
//         dispatch(logout());
//         return rejectWithValue("Token not found - GetUserSlice");
//       }

//       const response = await axios.get(`${URL}/api/auth/check`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // console.log("🧾response --->/GetuserSlice", response);
//       const userData = response?.data?.decoded;
//       // console.log("🔍userData --->GetuserSlice", userData);

//       if (userData && userData.email) {
//         dispatch(setAuthenticated({ user: userData }));
//         // console.log("📧userData.email --->GetuserSlice", userData.email);
//         return userData;
//       } else {
//         throw new Error("Invalid token");
//       }
//     } catch (error) {
//       console.log("🔴error --->GetuserSlice", error);
//       error.response?.data?.message || "Failed to Chake User";
//       // dispatch(logout());
//       return rejectWithValue("Authentication failed");
//     }
//   }
// );

// const getuserSlice = createSlice({
//   name: "checkAuth",
//   initialState: {
//     userData: null,
//     status: "idle",
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     logoutUser: (state) => {
//       state.userData = null;
//       localStorage.removeItem("Authtoken");
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(checkAuth.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(checkAuth.fulfilled, (state) => {
//         state.status = "succeeded";
//       })
//       .addCase(checkAuth.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   },
// });

// export const { logoutUser } = getuserSlice.actions;
// export default getuserSlice.reducer;
