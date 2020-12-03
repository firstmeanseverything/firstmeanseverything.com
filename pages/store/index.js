import { useRouter } from 'next/router'
import useSWR from 'swr'
import { gql } from 'graphql-request'

import { graphcmsClient } from '@lib/graphcms'

function Store({ categories }) {
  const router = useRouter()

  const { category } = router.query
  const { data, error } = useSWR(
    [
      gql`
        query ProductQuery($category: String) {
          products(where: { categories_every: { name: $category } }) {
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
