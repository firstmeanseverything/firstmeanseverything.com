import * as React from 'react'
import renderToString from 'next-mdx-remote/render-to-string'
import he from 'he'

import DaySection from '@/components/day-section'
import graphCmsClient from '@/lib/graphcms'
import mdxComponents from '@/components/mdx'
import Page from '@/components/page'
import ProgramMeta from '@/components/program-meta'
import { AuthProvider } from '@/context/auth'
import { useAuthenticatedPage } from '@/hooks/auth'

function SamplePage({ program }) {
  useAuthenticatedPage()

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
  const { programs } = await graphCmsClient.request(`
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
      id
    }
  }))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const {
    programs: [program]
  } = await graphCmsClient.request(
    `
    query SamplePageQuery($category: ProgramCategory!, $id: ID!) {
      programs: programWeeks(where: { category: $category, id: $id }) {
        bias
        category
        days {
          activeRecovery
          content
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
      id: params.id
    }
  )

  const { days, ...rest } = program

  return {
    props: {
      program: {
        days: await Promise.all(
          days.map(async ({ content, ...day }) => ({
            content: {
              mdx: await renderToString(he.decode(content), {
                components: mdxComponents,
                provider: { component: AuthProvider }
              }),
              markdown: content
            },
            ...day
          }))
        ),
        ...rest
      }
    }
  }
}

export default SamplePage
