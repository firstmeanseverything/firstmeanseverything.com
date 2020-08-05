import { graphcmsClient } from '../../../lib/graphcms'

function Program({ program }) {
  return program.id
}

export async function getStaticPaths() {
  const { programs } = await graphcmsClient.request(`
    {
      programs(where: { free: false }) {
        date
        category
        free
        id
      }
    }
  `)

  const paths = programs.map(({ category, date }) => ({
    params: {
      category: category.toLowerCase(),
      date,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const {
    programs: [program],
  } = await graphcmsClient.request(
    `
    query ProgramPageQuery($date: Date!, $category: ProgramCategory!) {
      programs(where: { date: $date, category: $category }) {
        date
        category
        free
        id
      }
    }`,
    {
      category: params.category.toUpperCase(),
      date: params.date,
    }
  )

  return {
    props: {
      program,
    },
  }
}

export default Program
