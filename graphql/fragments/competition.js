import { gql } from '@/lib/graphcms'

const CompetitionListFragment = gql`
  fragment CompetitionListFragment on CompetitionConnection {
    aggregate {
      count
    }
    edges {
      node {
        description
        endDate
        header {
          id
          url
        }
        id
        slug
        startDate
        title
        type
      }
    }
  }
`

export { CompetitionListFragment }
