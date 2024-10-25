import type { Config } from 'tailwindcss';

import daisyui from 'daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			container: {
				center: true,
				padding: '2rem'
			}
		}
	},

	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#06b6d4',
					'primary-content': '#ffffff',
					secondary: '#eab308',
					'secondary-content': '#130c00',
					accent: '#fb923c',
					'accent-content': '#150801',
					neutral: '#22272f',
					'neutral-content': '#d3d6da',
					'base-100': '#ffffff',
					'base-200': '#f0f0f0',
					'base-300': '#e6e6e6',
					'base-content': '#161616',
					info: '#06b6d4',
					'info-content': '#000c10',
					success: '#22c55e',
					'success-content': '#000e03',
					warning: '#facc15',
					'warning-content': '#150f00',
					error: '#ef4444',
					'error-content': '#140202'
				}
			}
		],
		logs: false
	},

	plugins: [daisyui]
} as Config;
