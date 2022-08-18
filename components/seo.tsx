import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import { defaultUrl } from 'next-seo.config'

interface SEOComponent {
  image?: {
    url: string
  }
  title: string
}

function SEO({ image, title, ...props }: SEOComponent) {
  const router = useRouter()

  const SEO = {
    openGraph: {
      ...(image && {
        images: [
          {
            alt: title,
            ...image
          }
        ]
      }),
      url: defaultUrl + router.asPath
    },
    ...props
  }

  return <NextSeo {...SEO} />
}

export default SEO
