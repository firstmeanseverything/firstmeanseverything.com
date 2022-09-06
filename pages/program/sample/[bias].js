import * as React from 'react'
import { useRouter } from 'next/router'
import { serialize } from 'next-mdx-remote/serialize'
import he from 'he'

import { getProgramsPaths, getSampleProgramPage } from '@/lib/graphcms'
import ProgramPage from '@/components/program-page'

function SamplePage({ programs }) {
  const router = useRouter()

  if (router.isFallback) return <div>Loading...</div>

  return <ProgramPage programs={programs} />
}

export async function getStaticPaths() {
  const { programs } = await getProgramsPaths({ free: true })

  return {
    paths: programs.map(({ bias }) => ({
      params: {
        bias: bias.toLowerCase()
      }
    })),
    fallback: true
  }
}

export async function getStaticProps({ params, preview = false }) {
  const { programs } = await getSampleProgramPage(
    {
      bias: params.bias.toUpperCase()
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
