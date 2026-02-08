module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        custom: {
          bg: 'var(--color-background)',
          text: 'var(--color-text)',
        }
      }
    },
  },
  plugins: [],
}
