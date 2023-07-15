import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import * as React from 'react'
import { useRouter } from 'next/router'
import { serialize } from 'next-mdx-remote/serialize'
import he from 'he'
import addDays from 'date-fns/addDays'

import ProgramPage from '@/components/program-page'
import { useProtectedPage } from '@/hooks/auth'
import { graphCmsSdk } from '@/graphql/client'
import { ProgramWeek, Stage } from '@/graphql/sdk'

interface SubscribedProgramPage {
  programs: ProgramWeek[]
}

const SubscribedProgramPage: NextPage<SubscribedProgramPage> = ({
  programs
}) => {
  const router = useRouter()

  if (router.isFallback) return <div>Loading...</div>

  useProtectedPage({ path: '/program', program: programs[0] })

  return <ProgramPage programs={programs} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { programs } = await graphCmsSdk.ProgramsPathsQuery({ free: false })

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

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false
}) => {
  const stage: Stage = preview ? Stage.Draft : Stage.Published

  const { programs } = await graphCmsSdk.ProgramPageQuery({
    date: params.date,
    stage: process.env.NODE_ENV === 'development' ? Stage.Draft : stage
  })

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
