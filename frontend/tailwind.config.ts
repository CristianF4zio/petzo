import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores suaves para PETZO
        'petro': {
          50: '#e6f0f2',
          100: '#b3d1d6',
          200: '#80b2ba',
          300: '#4d939e',
          400: '#1a7482',
          500: '#005566', // Azul petróleo principal
          600: '#004449',
          700: '#003333',
          800: '#002222',
          900: '#001111',
        },
        'mint': {
          50: '#f0fdf9',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Menta principal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
    },
  },
  plugins: [],
}
export default config

