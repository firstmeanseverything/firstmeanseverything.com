const description = 'Functional Fitness Competitions & Programming'
const url = 'https://firstmeanseverything.com'

const seo = {
  title: 'Functional Fitness Competitions & Programming',
  defaultTitle: 'First Means Everything',
  titleTemplate: '%s | First Means Everything',
  description,
  openGraph: {
    description,
    images: [
      {
        alt: 'First Means Everything',
        height: 630,
        width: 1200,
        url:
          process.env.NEXT_PUBLIC_OG_IMAGE_DEFAULT &&
          'https://media.graphassets.com/aOq2N2nkR3WLVXpczCEA'
      }
    ],
    title: 'First Means Everything',
    type: 'website',
    url
  }
}

export { seo as defaultSeo, url as defaultUrl }
