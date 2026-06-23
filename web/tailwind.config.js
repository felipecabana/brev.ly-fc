/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          base: '#2C46B1',
          dark: '#2C4091',
        },
        gray: {
          100: '#F9F9FB',
          200: '#E4E6EC',
          300: '#CDCFD5',
          400: '#74798B',
          500: '#4D505C',
          600: '#1F2025',
        },
        danger: '#B12C4D',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        logo: ['Quicksand', 'sans-serif'],
      },
      fontSize: {
        'body-xl': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'body-lg': ['18px', { lineHeight: '24px', fontWeight: '700' }],
        'body-md': ['14px', { lineHeight: '18px', fontWeight: '600' }],
        'body-sm': ['12px', { lineHeight: '16px' }],
        'body-xs': ['10px', { lineHeight: '14px' }],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
      },
    },
  },
  plugins: [],
}
