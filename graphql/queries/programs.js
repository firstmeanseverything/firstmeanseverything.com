import { gql } from '@/lib/graphcms'

const AvailablePrograms = gql`
  query AvailablePrograms(
    $category: ProgramCategory!
    $from: Date!
    $limit: Int!
    $offset: Int!
    $to: Date!
  ) {
    programs: programWeeksConnection(
      first: $limit
      orderBy: date_DESC
      skip: $offset
      where: { category: $category, date_gt: $from, date_lt: $to }
    ) {
      aggregate {
        count
      }
      edges {
        node {
          bias
          date
          category
          free
          id
          title
        }
      }
    }
  }
`

const AvailableFreePrograms = gql`
  query AvailableFreePrograms(
    $category: ProgramCategory!
    $limit: Int!
    $offset: Int!
  ) {
    programs: programWeeksConnection(
      first: $limit
      orderBy: createdAt_DESC
      skip: $offset
      where: { category: $category, free: true }
    ) {
      aggregate {
        count
      }
      edges {
        node {
          bias
          date
          category
          free
          id
          title
        }
      }
    }
  }
`

export { AvailablePrograms, AvailableFreePrograms }
