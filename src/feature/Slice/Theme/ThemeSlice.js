import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "dark" ? "dark" : "light";
};

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("theme", state.mode);
      document.documentElement.classList.toggle("dark", state.mode === "dark");
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem("theme", action.payload);
      document.documentElement.classList.toggle(
        "dark",
        action.payload === "dark"
      );
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
