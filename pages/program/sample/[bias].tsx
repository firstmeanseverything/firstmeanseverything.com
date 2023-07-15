import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import * as React from 'react'
import { useRouter } from 'next/router'
import { serialize } from 'next-mdx-remote/serialize'
import he from 'he'

import ProgramPage from '@/components/program-page'
import { graphCmsSdk } from '@/graphql/client'
import { type ProgramBias, ProgramWeek, Stage } from '@/graphql/sdk'

interface SamplePage {
  programs: ProgramWeek[]
}

const SamplePage: NextPage<SamplePage> = ({ programs }) => {
  const router = useRouter()

  if (router.isFallback) return <div>Loading...</div>

  return <ProgramPage programs={programs} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { programs } = await graphCmsSdk.ProgramsPathsQuery({ free: true })

  return {
    paths: programs.map(({ bias }) => ({
      params: {
        bias: bias.toLowerCase()
      }
    })),
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false
}) => {
  const stage: Stage = preview ? Stage.Draft : Stage.Published

  const { bias } = params as { bias: string }

  const { programs } = await graphCmsSdk.SampleProgramPageQuery({
    bias: bias.toUpperCase() as ProgramBias,
    free: true,
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
      preview,
      programs: await Promise.all(
        programs.map(async ({ days, notes, ...program }) => ({
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

export default SamplePage
