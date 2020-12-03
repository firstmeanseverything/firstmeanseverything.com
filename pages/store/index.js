import { useRouter } from 'next/router'
import useSWR from 'swr'
import { gql } from 'graphql-request'

import { graphcmsClient } from '@lib/graphcms'

function Store({ categories }) {
  const router = useRouter()

  const { category } = router.query

  const { data, error } = useSWR(
    category
      ? [
          gql`
            query ProductQuery($category: String) {
              products(where: { categories_every: { slug: $category } }) {
                id
                images {
                  id
                  height
                  url
                  width
                }
                name
                slug
              }
            }
          `,
          category
        ]
      : [
          gql`
            {
              products {
                id
                images {
                  id
                  height
                  url
                  width
                }
                name
                slug
              }
            }
          `,
          category
        ],
    (query, category) => graphcmsClient.request(query, { category })
  )

  return data
    ? data.products.map((product) => {
        return <pre>{JSON.stringify(product, null, 2)}</pre>
      })
    : 'Loading'
}

export async function getStaticProps() {
  const { categories } = await graphcmsClient.request(gql`
    {
      categories {
        id
        name
        slug
      }
    }
  `)

  return {
    props: {
      categories
    }
  }
}

export default Store
