import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        background:  'var(--background)',
        foreground:  'var(--foreground)',
        border:      'var(--border)',
        input:       'var(--input)',
        ring:        'var(--ring)',
        primary: {
          DEFAULT:    'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT:    'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT:    'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT:    'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        card: {
          DEFAULT:    'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        destructive: {
          DEFAULT:    'var(--destructive)',
          foreground: 'oklch(0.97 0.014 254.604)',
        },
        sidebar: {
          DEFAULT:    'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary:    'var(--sidebar-primary)',
          accent:     'var(--sidebar-accent)',
          border:     'var(--sidebar-border)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'slide-up':   { from: { opacity:'0', transform:'translateY(20px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        'fade-in':    { from: { opacity:'0' }, to: { opacity:'1' } },
        'pulse-blue': { '0%,100%': { boxShadow:'0 0 0 0 oklch(0.488 0.243 264.376 / 0.4)' }, '50%': { boxShadow:'0 0 0 8px oklch(0.488 0.243 264.376 / 0)' } },
        'shimmer':    { '0%': { backgroundPosition:'-200% 0' }, '100%': { backgroundPosition:'200% 0' } },
        'float':      { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-10px)' } },
      },
      animation: {
        'slide-up':   'slide-up 0.5s ease forwards',
        'fade-in':    'fade-in 0.4s ease forwards',
        'pulse-blue': 'pulse-blue 2s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'float':      'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
