module.exports = {
  purge: ['./components/**/*.js', './pages/**/*.js'],
  theme: {
    extend: {},
  },
  variants: {
    padding: ['first', 'responsive'],
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/ui')],
}
