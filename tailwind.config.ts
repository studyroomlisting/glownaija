import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Use simple names — no DEFAULT suffix issues in @apply
        rose:    '#E8607A',
        'rose-dark': '#C94D66',
        gold:    '#D4AF37',
        gn:      '#10B981',   // renamed from green to avoid Tailwind green conflict
        ink:     '#1C1008',
        'ink-2': '#3D2B1A',
        'ink-3': '#8C7B6E',
        page:    '#FFF9F5',
        'page-2':'#F5EDE5',
        bdr:     '#E8E0D8',   // renamed from border to avoid Tailwind conflict
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl:  '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

export default config
