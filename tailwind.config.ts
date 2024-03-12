import type { Config } from 'tailwindcss'

const config = {
  content: ['./src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
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
      screens: { xs: '375px' },
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
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/container-queries'),
  ],
} satisfies Config

export default config
