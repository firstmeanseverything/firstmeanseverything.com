import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import { defaultUrl } from 'next-seo.config'

interface SEOComponent {
  image?: {
    url: string
  }
  title: string
}

function SEO({ image, ...props }: SEOComponent) {
  const router = useRouter()

  const SEO = {
    openGraph: {
      ...(image && {
        images: [
          {
            alt: props.title,
            ...image
          }
        ]
      }),
      url: defaultUrl + router.asPath,
      ...props
    },
    ...props
  }

  return <NextSeo {...SEO} />
}

export default SEO
