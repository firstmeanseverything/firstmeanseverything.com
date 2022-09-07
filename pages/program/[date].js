import * as React from 'react'
import { useRouter } from 'next/router'
import { serialize } from 'next-mdx-remote/serialize'
import he from 'he'
import addDays from 'date-fns/addDays'

import { getProgramPage, getProgramsPaths } from '@/lib/graphcms'
import ProgramPage from '@/components/program-page'
import { useProtectedPage } from '@/hooks/auth'

function SubscribedProgramPage({ programs }) {
  const router = useRouter()

  if (router.isFallback) return <div>Loading...</div>

  useProtectedPage({ path: '/program', program: programs[0] })

  return <ProgramPage programs={programs} />
}

export async function getStaticPaths() {
  const { programs } = await getProgramsPaths({ free: false })

  const paths = programs.map(({ date }) => ({
    params: {
      date
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params, preview = false }) {
  const { programs } = await getProgramPage(
    {
      date: params.date
    },
    process.env.NODE_ENV === 'development' ? true : preview
  )

  if (!programs.length) {
    return {
      notFound: true,
      revalidate: 10
    }
  }

  return {
    props: {
      programs: await Promise.all(
        programs.map(async ({ days, notes, ...program }) => ({
          dateRange: new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'long'
          }).formatRange(
            new Date(program.date),
            addDays(new Date(program.date), 6)
          ),
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
          ...program
        }))
      )
    },
    revalidate: 10
  }
}

export default SubscribedProgramPage
