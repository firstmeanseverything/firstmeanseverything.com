import * as React from 'react'
import { useRouter } from 'next/router'
import { serialize } from 'next-mdx-remote/serialize'
import he from 'he'
import addDays from 'date-fns/addDays'

import { getProgramPage, getProgramsPaths } from '@/lib/graphcms'
import ProgramPage from '@/components/program-page'
import { useProtectedPage } from '@/hooks/auth'

function SubscribedProgramPage({ program }) {
  const router = useRouter()

  if (router.isFallback) return <div>Loading...</div>

  useProtectedPage({ path: '/program', program })

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
    fallback: 'blocking'
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
      notFound: true,
      revalidate: 10
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
              mdx: await serialize(he.decode(content)),
              markdown: content
            },
            ...day
          }))
        ),
        ...(notes && {
          notes: {
            mdx: await serialize(he.decode(notes)),
            markdown: notes
          }
        }),
        ...rest
      }
    },
    revalidate: 10
  }
}

export default SubscribedProgramPage
