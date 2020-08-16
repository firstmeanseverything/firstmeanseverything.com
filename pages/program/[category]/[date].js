import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'
import he from 'he'

import DaySection from '../../../components/day-section'
import { graphcmsClient } from '../../../lib/graphcms'
import Page from '../../../components/page'
import ProgramMeta from '../../../components/program-meta'
import { useAuthState } from '../../../context/auth'
import WorkoutBlock from '../../../components/workout-block'

const mdxComponents = {
  DaySection,
  Gymnastics: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Gymnastics">
      {children}
    </WorkoutBlock>
  ),
  Metcon: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Metcon">
      {children}
    </WorkoutBlock>
  ),
  Strength: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Strength">
      {children}
    </WorkoutBlock>
  ),
}

function ProgramPage({ program }) {
  const { user } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.stripeRole !== 'basic') router.push('/')
  }, [user])

  return (
    <Page title={program.title} meta={<ProgramMeta {...program} />}>
      <div className="bg-white shadow rounded sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dl className="divide-y space-y-6">
            {program.days.map((day) => {
              const mdxContent = hydrate(day.content.mdx, mdxComponents)

              return (
                <DaySection {...day} mdxContent={mdxContent} key={day.id} />
              )
            })}
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
          content {
            markdown
          }
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
              mdx: await renderToString(
                he.decode(content.markdown, mdxComponents)
              ),
              ...content,
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
