module.exports = {
  async redirects() {
    return [
      {
        source: '/program/:category/sample/:id',
        permanent: true,
        destination: '/'
      }
    ]
  },
  images: {
    domains: ['avatars1.githubusercontent.com', 'lh3.googleusercontent.com']
  }
}
