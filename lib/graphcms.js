import { gql, GraphQLClient } from 'graphql-request'

export default new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT, {
  headers: {
    authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN}`
  }
})

export { gql }
