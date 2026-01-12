/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#ffd1dc', // pastel pink
          orange: '#ffdfba', // pastel orange
          primary: '#e17055', // darker pastel orange/red for text
          secondary: '#fd79a8', // darker pastel pink for text
        }
      }
    }
  },
  plugins: [],
};
