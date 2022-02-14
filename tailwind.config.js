module.exports = {
  content: ['./components/**/*.js', './pages/**/*.js'],
  theme: {
    extend: {
      colors: {
        cornflower: '#6952ff',
        ecstasy: '#fb751c',
        saffron: '#f3c43d',
        screamin: '#4bf2a6',
        shark: '#262629'
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
}
