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
  experimental: {
    images: {
      allowFutureImage: true
    },
    newNextLinkBehavior: true
  },
  images: {
    domains: [
      'avatars1.githubusercontent.com',
      'lh3.googleusercontent.com',
      'media.graphassets.com'
    ]
  }
}
