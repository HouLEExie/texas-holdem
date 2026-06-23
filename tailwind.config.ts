import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        felt: {
          950: '#07110B',
          900: '#0B1A11',
          850: '#0F2117',
          800: '#142B1F',
          700: '#19452F',
        },
        chip: {
          500: '#16A34A',
          400: '#22C55E',
          300: '#86EFAC',
        },
        tableGold: '#D7B56D',
        tableRed: '#EF4444',
        tableSilver: '#C9D0D8',
        tableBronze: '#C5854A',
      },
      boxShadow: {
        glow: '0 0 24px rgba(215, 181, 109, 0.16)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
