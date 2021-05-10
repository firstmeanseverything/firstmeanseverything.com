const description = 'Functional Fitness Competitions & Programming'
const url = 'https://firstmeanseverything.com'

const seo = {
  title: 'Functional Fitness Competitions & Programming',
  defaultTitle: 'First Means Everything',
  titleTemplate: '%s | First Means Everything',
  description,
  openGraph: {
    description,
    title: 'First Means Everything',
    type: 'website',
    url
  }
}

export { seo as defaultSeo, url as defaultUrl }
