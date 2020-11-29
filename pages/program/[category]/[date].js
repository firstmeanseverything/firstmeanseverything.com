import * as React from 'react'
import { useRouter } from 'next/router'
import renderToString from 'next-mdx-remote/render-to-string'
import he from 'he'

import DaySection from 'components/day-section'
import { graphcmsClient } from 'lib/graphcms'
import mdxComponents from 'components/mdx'
import Page from 'components/page'
import ProgramMeta from 'components/program-meta'
import { useAuthState } from 'context/auth'

function ProgramPage({ program }) {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  React.useEffect(() => {
    const isFutureProgram = new Date(program.date) > new Date()

    if (
      isFutureProgram ||
      (!isAuthenticating && !(user || user.stripeRole === 'basic'))
    )
      router.push('/')
  }, [isAuthenticating, program, user])

  return (
    <Page title={program.title} meta={<ProgramMeta {...program} />}>
      <div className="bg-white shadow rounded sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dl className="divide-y space-y-6">
            {[...program.days, { rest: true, title: 'Sunday' }].map(DaySection)}
          </dl>
        </div>
      </div>
    </Page>
  )
}

export async function getStaticPaths() {
  const { programs } = await graphcmsClient.request(`
    {
      programs: programWeeks(where: { free: false }) {
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
      programs: programWeeks(where: { date: $date, category: $category }) {
        bias
        category
        days {
          activeRecovery
          content
          id
          title
        }
        date
        free
        id
        title
      }
    }`,
    {
      category: params.category.toUpperCase(),
      date: params.date,
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
              }),
              markdown: content,
            },
            ...day,
          }))
        ),
        ...rest,
      },
    },
  }
}

export default ProgramPage
