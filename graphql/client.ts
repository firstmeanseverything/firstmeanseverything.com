import { GraphQLClient } from 'graphql-request'

import { getSdk } from './sdk'

const graphCmsClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHCMS_URL!,
  {
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN}`
    }
  }
)

export const graphCmsSdk = getSdk(graphCmsClient)
