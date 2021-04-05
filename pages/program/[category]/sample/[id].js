import * as React from 'react'
import { useRouter } from 'next/router'
import renderToString from 'next-mdx-remote/render-to-string'
import he from 'he'

import DaySection from '@/components/day-section'
import { getProgramsPaths, getSampleProgramPage } from '@/lib/graphcms'
import mdxComponents from '@/components/mdx'
import Page from '@/components/page'
import ProgramMeta from '@/components/program-meta'
import { AuthProvider } from '@/context/auth'
import { useAuthenticatedPage } from '@/hooks/auth'

function SamplePage({ program }) {
  const router = useRouter()

  if (router.isFallback) return <div>Loading...</div>

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
  const { programs } = await getProgramsPaths({ free: true })

  const paths = programs.map(({ category, id }) => ({
    params: {
      category: category.toLowerCase(),
      id
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
  } = await getSampleProgramPage(
    {
      category: params.category.toUpperCase(),
      id: params.id
    },
    preview
  )

  if (!program) {
    return {
      notFound: true
    }
  }

  const { days, ...rest } = program

  return {
    props: {
      preview,
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
