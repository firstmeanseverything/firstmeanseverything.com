import * as React from 'react'
import { useRouter } from 'next/router'
import renderToString from 'next-mdx-remote/render-to-string'
import he from 'he'

import { AuthProvider } from '@/context/auth'
import DaySection from '@/components/day-section'
import { getProgramPage, getProgramsPaths } from '@/lib/graphcms'
import mdxComponents from '@/components/mdx'
import Page from '@/components/page'
import ProgramMeta from '@/components/program-meta'
import {
  useAccessiblePage,
  useAuthenticatedPage,
  useProtectedPage
} from '@/hooks/auth'

function ProgramPage({ program }) {
  const router = useRouter()

  if (router.isFallback) return <div>Loading...</div>

  useAuthenticatedPage()
  useProtectedPage()
  useAccessiblePage({ programDate: program.date })

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
  const { programs } = await getProgramsPaths({ free: false })

  const paths = programs.map(({ category, date }) => ({
    params: {
      category: category.toLowerCase(),
      date
    }
  }))

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ params, preview = false }) {
  const {
    programs: [program]
  } = await getProgramPage(
    {
      category: params.category.toUpperCase(),
      date: params.date
    },
    process.env.NODE_ENV === 'development' ? true : preview
  )

  if (!program) {
    return {
      notFound: true
    }
  }

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

export default ProgramPage
