import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-theme="forest"]'],
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
    darkTheme: 'forest',
    themes: [
      {
        lemonade: {
          primary: '#529b03',
          secondary: '#e9e92f',
          accent: '#f6f9c8',
          neutral: '#191a3e',
          'base-100': '#ffffff',
          info: '#3abff8',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#f87272',
        },
      },
      {
        forest: {
          primary: '#1eb854',
          secondary: '#1db990',
          accent: '#1db9ac',
          neutral: '#18342b',
          'base-100': '#202124',
          info: '#3abff8',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#f87272',
        },
      },
    ],
  },
};

export default config;
