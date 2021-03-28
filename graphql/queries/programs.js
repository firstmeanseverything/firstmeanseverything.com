import { gql } from '@/lib/graphcms'

const AvailableProgramsQuery = gql`
  query AvailableProgramsQuery(
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

const ProgramsPathsQuery = gql`
  query ProgramsPathsQuery($free: Boolean!) {
    programs: programWeeks(where: { free: $free }) {
      date
      category
    }
  }
`

const AvailableSampleProgramsQuery = gql`
  query AvailableSampleProgramsQuery(
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

const ProgramPageQuery = gql`
  query ProgramPageQuery($date: Date!, $category: ProgramCategory!) {
    programs: programWeeks(where: { date: $date, category: $category }) {
      bias
      category
      days {
        activeRecovery
        content
        id
        title
      }
      date
      free
      id
      title
    }
  }
`

const SampleProgramPageQuery = gql`
  query SampleProgramPageQuery($category: ProgramCategory!, $id: ID!) {
    programs: programWeeks(where: { category: $category, id: $id }) {
      bias
      category
      days {
        activeRecovery
        content
        id
        title
      }
      free
      id
      title
    }
  }
`

export {
  AvailableProgramsQuery,
  AvailableSampleProgramsQuery,
  ProgramPageQuery,
  ProgramsPathsQuery,
  SampleProgramPageQuery
}
