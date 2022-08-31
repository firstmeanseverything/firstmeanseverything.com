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

function SEO({ image, ...props }: SEOComponent) {
  const router = useRouter()

  const SEO = {
    openGraph: {
      ...(image?.url && {
        images: [
          {
            alt: props.title,
            height: 630,
            width: 1200,
            ...image
          }
        ]
      }),
      url: defaultUrl + router.asPath
    },
    additionalLinkTags: [
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '180x180'
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-32x32.png',
        sizes: '32x32'
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon-16x16.png',
        sizes: '16x16'
      },
      {
        rel: 'manifest',
        href: '/site.manifest'
      },
      {
        rel: 'mask-icon',
        href: '/safari-pinned-tab.svg',
        color: '#262629'
      }
    ],
    ...props
  }

  return <NextSeo {...SEO} />
}

export default SEO
