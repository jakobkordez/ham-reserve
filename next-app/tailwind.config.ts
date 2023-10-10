import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="night"]'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'night'],
  },
};
export default config;
