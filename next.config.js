module.exports = {
  async redirects() {
    return [
      {
        destination: '/program/:date',
        permanent: true,
        source: '/program/:category/:date'
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
