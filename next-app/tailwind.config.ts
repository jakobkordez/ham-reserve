import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-theme="night"]'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        DEFAULT: '100%',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    logs: false,
    darkTheme: 'night',
    themes: ['lemonade', 'night'],
  },
};

export default config;
