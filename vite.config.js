import { defineConfig } from "vite";
// const withMT = require("@material-tailwind/react/utils/withMT");
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
});
