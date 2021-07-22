import * as React from 'react'
import { useRouter } from 'next/router'
import { serialize } from 'next-mdx-remote/serialize'
import he from 'he'

import { getProgramsPaths, getSampleProgramPage } from '@/lib/graphcms'
import ProgramPage from '@/components/program-page'
import { useAuthenticatedPage } from '@/hooks/auth'

function SamplePage({ program }) {
  const router = useRouter()

  if (router.isFallback) return <div>Loading...</div>

  useAuthenticatedPage()

  return <ProgramPage program={program} />
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
      preview,
      program: {
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

export default SamplePage
