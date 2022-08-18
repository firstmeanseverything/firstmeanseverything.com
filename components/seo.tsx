import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import { defaultUrl } from 'next-seo.config'

interface SEOComponent {
  /**
   * Page description to override site default.
   */
  description?: string
  /**
   * Image to be used for page previews.
   */
  image?: {
    url: string
  }
  /**
   * Page title to override site default.
   */
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
