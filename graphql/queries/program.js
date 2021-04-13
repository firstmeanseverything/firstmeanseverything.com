import { gql } from '@/lib/graphcms'
import { ProgramListFragment, ProgramPageFragment } from '@/fragments/program'

const ProgramPageQuery = gql`
  query ProgramPageQuery(
    $date: Date!
    $category: ProgramCategory!
    $stage: Stage!
  ) {
    programs: programWeeks(
      stage: $stage
      where: { date: $date, category: $category }
    ) {
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
    $to: Date!
  ) {
    programs: programWeeksConnection(
      first: $limit
      orderBy: date_DESC
      skip: $offset
      stage: $stage
      where: { category: $category, date_gte: $from, date_lte: $to }
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
      date
      category
    }
  }
`

const SampleProgramsListQuery = gql`
  query SampleProgramsListQuery($limit: Int!, $offset: Int!, $stage: Stage!) {
    programs: programWeeksConnection(
      first: $limit
      orderBy: createdAt_DESC
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
    $category: ProgramCategory!
    $id: ID!
    $stage: Stage!
  ) {
    programs: programWeeks(
      stage: $stage
      where: { category: $category, id: $id }
    ) {
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
