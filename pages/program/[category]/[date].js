import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'
import he from 'he'

import DaySection from '../../../components/day-section'
import { graphcmsClient } from '../../../lib/graphcms'
import Page from '../../../components/page'
import { useAuthState } from '../../../context/auth'

const mdxComponents = {
  DaySection,
}

function ProgramPage({ program }) {
  const { user } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.stripeRole !== 'basic') router.push('/')
  }, [user])

  const ProgramMeta = ({ bias, category, date }) => {
    return (
      <React.Fragment>
        <div class="mt-2 flex items-center text-sm leading-5 text-gray-500">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {category}
          </span>
        </div>
        <div class="mt-2 flex items-center text-sm leading-5 text-gray-500">
          <svg
            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          {new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date(date))}
        </div>
        <div class="mt-2 flex items-center text-sm leading-5 text-gray-500">
          <svg
            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {bias}
        </div>
      </React.Fragment>
    )
  }

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
