/** @type {import('tailwindcss').Config} */
export default {
  content: ['./entrypoints/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--miko-canvas)',
        card: 'var(--miko-card)',
        fg: 'var(--miko-fg)',
        muted: 'var(--miko-muted)',
        line: 'var(--miko-line)',
        danger: 'var(--miko-danger)',
        accent: {
          DEFAULT: 'var(--miko-accent)',
          hover: 'var(--miko-accent-hover)',
          fg: 'var(--miko-accent-fg)',
          soft: 'var(--miko-accent-soft)',
          ring: 'var(--miko-accent-ring)',
          text: 'var(--miko-accent-text)',
        },
      },
    },
  },
  plugins: [],
}
