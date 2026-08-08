import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:     '#ffffff',
        ink:    '#161513',
        brand:  '#b91c1c',
        muted:  '#8c8b85',
        border: '#e8e6e1',
      },
      fontFamily: {
        garamond: ['EB Garamond Variable', 'Georgia', 'Cambria', 'serif'],
        sans: ['Instrument Sans Variable', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        gallery: '0.18em',
        wide:    '0.08em',
      },
    },
  },
  plugins: [typography],
}

export default config
