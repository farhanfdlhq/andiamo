// Andiamo/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}", // Ini akan mencakup semua file di dalam folder src
  ],
  theme: {
    extend: {
      // Anda bisa menambahkan kustomisasi tema di sini jika perlu
      // Misalnya, warna logo Anda dari constants.tsx
      colors: {
        primary: "#abcdef", // Ganti dengan nilai PRIMARY_COLOR Anda
        secondary: "#123456", // Ganti dengan nilai SECONDARY_COLOR Anda
      },
      fontFamily: {
        // Jika Anda menggunakan font kustom seperti 'Poppins' atau 'Inter'
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
