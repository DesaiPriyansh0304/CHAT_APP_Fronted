import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    newMessageReceived: (state, action) => {
      state.messages.push(action.payload);
    },
    addOwnMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setMessages, newMessageReceived, addOwnMessage } = chatSlice.actions;
export default chatSlice.reducer;
