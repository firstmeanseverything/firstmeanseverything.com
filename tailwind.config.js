module.exports = {
  purge: ['./components/**/*.js', './pages/**/*.js'],
  theme: {
    extend: {
      colors: {
        ecstasy: '#fb751c',
        saffron: '#f3c43d',
        shark: '#262629'
      }
    }
  },
  variants: {
    extend: {
      padding: ['first', 'responsive']
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
