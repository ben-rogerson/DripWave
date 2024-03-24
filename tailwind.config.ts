import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'
import containerQueries from '@tailwindcss/container-queries'

export const screens = {
  xs: '375px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

const config = {
  content: ['./src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    screens,
    colors: {
      foreground: 'hsl(var(--foreground))',
      background: 'hsl(var(--background))',
      transparent: 'transparent',
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      destructive: 'hsl(var(--destructive))',
      muted: 'hsl(var(--muted))',
      accent: 'hsl(var(--accent))',
      border: 'hsl(var(--border))',
      ring: 'hsl(var(--ring))',
    },
    extend: {
      zIndex: { behind: '-1' },
      spacing: { inherit: 'inherit' },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      transitionDelay: {
        2000: '2000ms',
        3000: '3000ms',
      },
    },
  },
  plugins: [animate, containerQueries],
} satisfies Config

export default config
