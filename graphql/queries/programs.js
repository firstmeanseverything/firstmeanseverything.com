import { gql } from '@/lib/graphcms'

const AvailablePrograms = gql`
  query AvailablePrograms($category: ProgramCategory!, $date: Date!) {
    programs: programWeeks(
      orderBy: date_DESC
      where: { date_lt: $date, category: $category }
    ) {
      bias
      date
      category
      free
      id
      title
    }
  }
`

const AvailableFreePrograms = gql`
  query AvailableFreePrograms($category: ProgramCategory!) {
    programs: programWeeks(
      orderBy: createdAt_DESC
      where: { category: $category, free: true }
    ) {
      bias
      date
      category
      free
      id
      title
    }
  }
`

export { AvailablePrograms, AvailableFreePrograms }
