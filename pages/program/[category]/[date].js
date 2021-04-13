import * as React from 'react'
import { useRouter } from 'next/router'
import renderToString from 'next-mdx-remote/render-to-string'
import he from 'he'
import addDays from 'date-fns/addDays'

import { AuthProvider } from '@/context/auth'
import { getProgramPage, getProgramsPaths } from '@/lib/graphcms'
import mdxComponents from '@/components/mdx'
import ProgramPage from '@/components/program-page'
import {
  useAccessiblePage,
  useAuthenticatedPage,
  useProtectedPage
} from '@/hooks/auth'

function SubscribedProgramPage({ program }) {
  const router = useRouter()

  if (router.isFallback) return <div>Loading...</div>

  useAuthenticatedPage()
  useProtectedPage()
  useAccessiblePage({ programDate: program.date })

  return <ProgramPage program={program} />
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

  const { days, notes, ...rest } = program

  return {
    props: {
      program: {
        dateRange: new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'long'
        }).formatRange(new Date(rest.date), addDays(new Date(rest.date), 6)),
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
        notes: {
          mdx: await renderToString(he.decode(notes), {
            components: mdxComponents,
            provider: { component: AuthProvider }
          }),
          markdown: notes
        },
        ...rest
      }
    }
  }
}

export default SubscribedProgramPage
