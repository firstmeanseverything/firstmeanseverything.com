module.exports = {
  purge: ['./components/**/*.js', './pages/**/*.js'],
  theme: {
    extend: {
      colors: {
        ecstasy: '#fb751c',
        saffron: '#f3c43d',
        shark: '#262629'
      },
      typography: {
        DEFAULT: {
          css: {
            li: {
              'white-space': 'normal'
            }
          }
        }
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
