import { useEffect } from 'react'
import { useRouter } from 'next/router'
import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'

import { graphcmsClient } from '../../../../lib/graphcms'
import { useAuthState } from '../../../../context/auth'

const components = { h1: (props) => <h1 {...props} /> }

function SamplePage({ program }) {
  const { user } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push('/')
  }, [user])

  const content = hydrate(program.mdx, components)

  return content
}

export async function getStaticPaths() {
  const { programs } = await graphcmsClient.request(`
    {
      programs(where: { free: true }) {
        category
        id
      }
    }
  `)

  const paths = programs.map(({ category, id }) => ({
    params: {
      category: category.toLowerCase(),
      id,
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
    query SamplePageQuery($category: ProgramCategory!, $id: ID!) {
      programs(where: { category: $category, id: $id }) {
        content {
          markdown
        }
        category
        free
        id
      }
    }`,
    {
      category: params.category.toUpperCase(),
      id: params.id,
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

export default SamplePage
