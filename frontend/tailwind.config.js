import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Playfair Display'", 'serif'],
        display: ["'Playfair Display'", 'serif'],
      },
    },
  },
  plugins: [forms],
};
