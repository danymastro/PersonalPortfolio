/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: '#FFFDF5',
          yellow: '#FDE047',
          pink: '#F9A8D4',
          blue: '#2563EB',
          purple: '#C084FC',
          green: '#4ADE80',
          orange: '#FB923C',
        }
      },
      fontFamily: {
        syne: ['"Syne"', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'neo': '6px 6px 0px 0px rgba(0,0,0,1)',
        'neo-sm': '3px 3px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'neo-xl': '12px 12px 0px 0px rgba(0,0,0,1)',
        'neo-hover': '8px 8px 0px 0px rgba(0,0,0,1)',
      },
      animation: {
        'blob': 'move-blob 10s infinite',
        'marquee': 'marquee 22s linear infinite',
        'marquee-reverse': 'marquee-reverse 22s linear infinite',
      },
      keyframes: {
        'move-blob': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}
