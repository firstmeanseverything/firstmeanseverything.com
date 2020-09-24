module.exports = {
  purge: ['./components/**/*.js', './pages/**/*.js'],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  theme: {
    extend: {},
  },
  variants: {
    padding: ['first', 'responsive'],
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/ui')],
}
