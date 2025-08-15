import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("Theme");
  const theme = savedTheme === "dark" ? "dark" : "light";

  // Apply theme class immediately on initialization
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }

  return theme;
};

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("Theme", state.mode);
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle(
          "dark",
          state.mode === "dark"
        );
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem("Theme", action.payload);
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle(
          "dark",
          action.payload === "dark"
        );
      }
    },
    initializeTheme: (state) => {
      const savedTheme = localStorage.getItem("Theme");
      if (savedTheme) {
        state.mode = savedTheme;
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle(
            "dark",
            savedTheme === "dark"
          );
        }
      }
    },
  },
});

export const { toggleTheme, setTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
