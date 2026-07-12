import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:  '#fffbf7',
        ink:    '#1a1a18',
        brand:  '#b91c1c',
        muted:  '#9a9186',
        border: '#e5ddd4',
      },
      fontFamily: {
        garamond: ['EB Garamond Variable', 'Georgia', 'Cambria', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
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
