/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      },
      colors: {
        'transparent': 'transparent',
        'tekhelet': {
          DEFAULT: '#503674',
          100: '#100b17',
          200: '#20162e',
          300: '#2f2045',
          400: '#3f2b5c',
          500: '#503674',
          600: '#6f4ca1',
          700: '#9274bd',

          800: '#b7a2d3',
          900: '#dbd1e9',
        },
        'goldenrod': {
          DEFAULT: '#d6a816', 
          100: '#2a2204', 
          200: '#554309', 
          300: '#7f650d', 
          400: '#aa8612', 
          500: '#d6a816', 
          600: '#eac038', 
          700: '#efd069',
          800: '#f5e09b',
          900: '#faefcd',
        },
        'black': {
          DEFAULT: '#000000',
          100: '#1a1a1a',
          200: '#333333',
          300: '#4d4d4d',
          400: '#666666',
          500: '#808080',
          600: '#999999',
          700: '#b3b3b3',
          800: '#cccccc',
          900: '#e6e6e6',
        },
        'white': {
          DEFAULT: '#ffffff',
          100: '#1a1a1a',
          200: '#333333',
          300: '#4d4d4d',
          400: '#666666',
          500: '#808080',
          600: '#999999',
          700: '#b3b3b3',
          800: '#cccccc',
          900: '#e6e6e6',
        },
        'pink': {
          DEFAULT: '#8F87F1',
          100: '#ff69b4',
          200: '#ff69b4',
          300: '#ff69b4',
          400: '#ff69b4',
          500: '#ff69b4',
          600: '#ff69b4',
          700: '#ff69b4',
          800: '#ff69b4',
          900: '#ff69b4',
        },
  
      },





    extend: {},
  },
  plugins: [],
}