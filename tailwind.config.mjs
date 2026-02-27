/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3713ec',
        secondary: '#7c3aed',
        accent: '#00f0ff',
        'bg-dark': '#0a0a0f',
        'surface-dark': '#13111c',
        'surface-lighter': '#1c1a29',
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(to right, #1f1d2e 1px, transparent 1px), linear-gradient(to bottom, #1f1d2e 1px, transparent 1px)',
        'radial-glow':
          'radial-gradient(circle at center, rgba(55, 19, 236, 0.15) 0%, rgba(10, 10, 15, 0) 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        radar: 'radar 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        radar: {
          '0%': { width: '0%', height: '0%', opacity: '0.8' },
          '100%': { width: '200%', height: '200%', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
