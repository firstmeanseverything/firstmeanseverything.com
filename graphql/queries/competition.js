import { gql } from '@/lib/graphcms'
import { CompetitionListFragment } from '@/fragments/competition'

const CompetitionPageQuery = gql`
  query CompetitionPageQuery($slug: String!, $stage: Stage!) {
    competition(stage: $stage, where: { slug: $slug }) {
      id
      content
      description
      endDate
      files {
        id
        fileName
        url
      }
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
      venue {
        id
        address
        latitude
        longitude
      }
    }
  }
`

const CompetitionsListQuery = gql`
  query CompetitionsListQuery() {
    competitions: competitionsConnection(
      orderBy: startDate_DESC
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
