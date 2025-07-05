// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const URL = import.meta.env.VITE_REACT_APP_URL;

// export const sendMessage = createAsyncThunk(
//   "messages/sendMessage",
//   async ({ receiverId, text, image }, { rejectWithValue, getState }) => {
//     const token = getState().auth.token;

//     try {
//       const response = await axios.post(
//         `${URL}/api/msg/send/${receiverId}`,
//         { text, image }, // sending message content here
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return response.data.newMessage;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// const messageSlice = createSlice({
//   name: "sendmessages",
//   initialState: {
//     messages: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(sendMessage.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(sendMessage.fulfilled, (state, action) => {
//         state.loading = false;
//         state.messages.push(action.payload);
//       })
//       .addCase(sendMessage.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to send message";
//       });
//   },
// });

// export default messageSlice.reducer;
