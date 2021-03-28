import { gql } from '@/lib/graphcms'
import { ProgramListFragment, ProgramPageFragment } from '@/fragments/program'

const ProgramPageQuery = gql`
  query ProgramPageQuery($date: Date!, $category: ProgramCategory!) {
    programs: programWeeks(where: { date: $date, category: $category }) {
      date
      ...ProgramPageFragment
    }
  }

  ${ProgramPageFragment}
`

const ProgramsListQuery = gql`
  query ProgramsListQuery(
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
      ...ProgramListFragment
    }
  }

  ${ProgramListFragment}
`

const ProgramsPathsQuery = gql`
  query ProgramsPathsQuery($free: Boolean!) {
    programs: programWeeks(where: { free: $free }) {
      date
      category
    }
  }
`

const SampleProgramsListQuery = gql`
  query SampleProgramsListQuery(
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
      ...ProgramListFragment
    }
  }

  ${ProgramListFragment}
`

const SampleProgramPageQuery = gql`
  query SampleProgramPageQuery($category: ProgramCategory!, $id: ID!) {
    programs: programWeeks(where: { category: $category, id: $id }) {
      ...ProgramPageFragment
    }
  }

  ${ProgramPageFragment}
`

export {
  ProgramPageQuery,
  ProgramsListQuery,
  ProgramsPathsQuery,
  SampleProgramsListQuery,
  SampleProgramPageQuery
}
