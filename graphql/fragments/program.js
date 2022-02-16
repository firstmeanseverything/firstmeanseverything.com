import { gql } from '@/lib/graphcms'

const ProgramListFragment = gql`
  fragment ProgramListFragment on ProgramWeekConnection {
    aggregate {
      count
    }
    edges {
      node {
        bias
        createdBy {
          name
          picture
        }
        date
        category
        free
        id
        test
        title
      }
    }
  }
`

const ProgramPageFragment = gql`
  fragment ProgramPageFragment on ProgramWeek {
    bias
    category
    createdBy {
      name
      picture
    }
    days {
      activeRecovery
      content
      id
      title
    }
    free
    id
    notes
    test
    title
  }
`

export { ProgramListFragment, ProgramPageFragment }
