import { gql } from '@/lib/graphcms'
import { CompetitionListFragment } from '@/fragments/competition'

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

export { CompetitionsListQuery }
