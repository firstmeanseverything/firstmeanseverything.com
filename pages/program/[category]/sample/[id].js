import { useEffect } from 'react'
import { useRouter } from 'next/router'
import renderToString from 'next-mdx-remote/render-to-string'
import he from 'he'

import DaySection from '../../../../components/day-section'
import { graphcmsClient } from '../../../../lib/graphcms'
import mdxComponents from '../../../../components/mdx'
import Page from '../../../../components/page'
import ProgramMeta from '../../../../components/program-meta'
import { useAuthState } from '../../../../context/auth'

function SamplePage({ program }) {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticating && !user) router.push('/')
  }, [isAuthenticating, user])

  return (
    <Page title={program.title} meta={<ProgramMeta {...program} />}>
      <div className="bg-white shadow rounded sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dl className="divide-y space-y-6">{program.days.map(DaySection)}</dl>
        </div>
      </div>
    </Page>
  )
}

export async function getStaticPaths() {
  const { programs } = await graphcmsClient.request(`
    {
      programs: programWeeks(where: { free: true }) {
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
      programs: programWeeks(where: { category: $category, id: $id }) {
        bias
        category
        days {
          activeRecovery
          content {
            markdown
          }
          id
          title
        }
        free
        id
        title
      }
    }`,
    {
      category: params.category.toUpperCase(),
      id: params.id,
    }
  )

  const { days, ...rest } = program

  return {
    props: {
      program: {
        days: await Promise.all(
          days.map(async ({ content, ...day }) => ({
            content: {
              mdx: await renderToString(he.decode(content.markdown), {
                components: mdxComponents,
              }),
              ...content,
            },
            ...day,
          }))
        ),
        ...rest,
      },
    },
  }
}

export default SamplePage
