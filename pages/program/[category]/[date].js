import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'

import { graphcmsClient } from '../../../lib/graphcms'

const components = { h1: (props) => <h1 {...props} /> }

function ProgramPage({ program }) {
  const content = hydrate(program.mdx, components)

  return content
}

export async function getStaticPaths() {
  const { programs } = await graphcmsClient.request(`
    {
      programs(where: { free: false }) {
        date
        category
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
        content {
          markdown
        }
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
      program: {
        mdx: await renderToString(program.content.markdown, components),
        ...program,
      },
    },
  }
}

export default ProgramPage
