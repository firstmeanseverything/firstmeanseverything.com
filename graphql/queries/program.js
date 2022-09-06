import { gql } from '@/lib/graphcms'
import { ProgramListFragment, ProgramPageFragment } from '@/fragments/program'

const ProgramPageQuery = gql`
  query ProgramPageQuery($date: Date!, $stage: Stage!) {
    programs: programWeeks(stage: $stage, where: { date: $date }) {
      date
      ...ProgramPageFragment
    }
  }

  ${ProgramPageFragment}
`

const ProgramPreviewPageQuery = gql`
  query ProgramPreviewPageQuery($id: ID!, $stage: Stage!) {
    program: programWeek(stage: $stage, where: { id: $id }) {
      id
      category
      date
      free
    }
  }
`

const ProgramsListQuery = gql`
  query ProgramsListQuery(
    $category: ProgramCategory!
    $from: Date!
    $limit: Int!
    $offset: Int!
    $stage: Stage!
  ) {
    programs: programWeeksConnection(
      first: $limit
      orderBy: date_DESC
      skip: $offset
      stage: $stage
      where: {
        OR: [
          { category: $category, date_gte: $from }
          { category: $category, test: true }
        ]
      }
    ) {
      ...ProgramListFragment
    }
  }

  ${ProgramListFragment}
`

const ProgramsPathsQuery = gql`
  query ProgramsPathsQuery($free: Boolean!) {
    programs: programWeeks(where: { free: $free }) {
      id
      bias
      date
    }
  }
`

const SampleProgramsListQuery = gql`
  query SampleProgramsListQuery($limit: Int!, $offset: Int!, $stage: Stage!) {
    programs: programWeeksConnection(
      first: $limit
      orderBy: createdAt_ASC
      skip: $offset
      stage: $stage
      where: { free: true }
    ) {
      ...ProgramListFragment
    }
  }

  ${ProgramListFragment}
`

const SampleProgramPageQuery = gql`
  query SampleProgramPageQuery(
    $bias: ProgramBias!
    $free: Boolean!
    $stage: Stage!
  ) {
    programs: programWeeks(stage: $stage, where: { bias: $bias, free: $free }) {
      ...ProgramPageFragment
    }
  }

  ${ProgramPageFragment}
`

export {
  ProgramPageQuery,
  ProgramPreviewPageQuery,
  ProgramsListQuery,
  ProgramsPathsQuery,
  SampleProgramsListQuery,
  SampleProgramPageQuery
}
