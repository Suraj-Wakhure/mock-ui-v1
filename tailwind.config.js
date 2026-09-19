/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: 'var(--bg-app)',
        surface: 'var(--bg-surface)',
        subtle: 'var(--bg-subtle)',
        border: 'var(--border)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        brand: {
          DEFAULT: 'var(--brand)',
          dark: 'var(--brand-dark)',
          subtle: 'var(--brand-subtle)',
        },
        copper: 'var(--accent-copper)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        info: 'var(--info)',
        // Prospectivity colors (Non-red-green)
        prospect: {
          low: '#DCE9ED',
          medium: '#4E9CA0',
          high: '#163E63',
          'low-dark': '#1e323b',
          'med-dark': '#296b70',
          'high-dark': '#488eb8',
        }
      },
      fontFamily: {
        sans: ['"Outfit"', '"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '6px',
        xl: '8px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'panel': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        'popover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
