module.exports = {
  purge: ['./components/**/*.js', './pages/**/*.js'],
  theme: {
    extend: {}
  },
  variants: {
    extend: {
      padding: ['first', 'responsive']
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
