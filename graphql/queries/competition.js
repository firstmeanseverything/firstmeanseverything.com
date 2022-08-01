import { gql } from '@/lib/graphcms'
import { CompetitionListFragment } from '@/fragments/competition'

const CompetitionPageQuery = gql`
  query CompetitionPageQuery($slug: String!, $stage: Stage!) {
    competition(stage: $stage, where: { slug: $slug }) {
      id
      description
      endDate
      header {
        id
        height
        url
        width
      }
      slug
      startDate
      title
      type
      url
    }
  }
`

const CompetitionsListQuery = gql`
  query CompetitionsListQuery($type: CompetitionType!) {
    competitions: competitionsConnection(
      orderBy: startDate_DESC
      where: { type: $type }
    ) {
      ...CompetitionListFragment
    }
  }

  ${CompetitionListFragment}
`

const CompetitionsPathsQuery = gql`
  query CompetitionsPathsQuery {
    competitions {
      id
      slug
    }
  }
`

export { CompetitionPageQuery, CompetitionsListQuery, CompetitionsPathsQuery }
