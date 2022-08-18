import { gql } from '@/lib/graphcms'

const CompetitionListFragment = gql`
  fragment CompetitionListFragment on CompetitionConnection {
    aggregate {
      count
    }
    edges {
      node {
        content
        description
        endDate
        header {
          height
          id
          url
          width
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
