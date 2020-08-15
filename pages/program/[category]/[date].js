import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'
import cx from 'classnames'
import he from 'he'

import { graphcmsClient } from '../../../lib/graphcms'
import Page from '../../../components/page'
import { useAuthState } from '../../../context/auth'

function ProgramPage({ program }) {
  const { user } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.stripeRole !== 'basic') router.push('/')
  }, [user])

  const DaySection = ({ children, title }) => {
    const [dayOpen, setDayOpen] = useState(false)

    const toggleDayOpen = () => setDayOpen((open) => !open)

    return (
      <div className="pt-6 first:pt-0">
        <dt className="text-2xl leading-7">
          <button
            onClick={() => toggleDayOpen()}
            className="text-left w-full flex justify-between items-start text-gray-400 focus:outline-none focus:text-gray-900"
          >
            <span className="font-medium text-gray-900">{title}</span>
            <span className="ml-6 h-7 flex items-center">
              <svg
                className={cx('h-6 w-6 transform', {
                  '-rotate-180': dayOpen,
                  'rotate-0': !dayOpen,
                })}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>
        </dt>
        <dd
          className={cx('border-t mt-6 pr-12 pt-6', {
            hidden: !dayOpen,
          })}
        >
          <div className="prose">{children}</div>
        </dd>
      </div>
    )
  }

  const content = hydrate(program.mdx, { DaySection })

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
          <dl className="divide-y space-y-6">{content}</dl>
        </div>
      </div>
    </Page>
  )
}

export async function getStaticPaths() {
  const { programs } = await graphcmsClient.request(`
    {
      programs(where: { free: false }) {
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
      programs(where: { date: $date, category: $category }) {
        bias
        category
        content {
          markdown
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

  return {
    props: {
      program: {
        mdx: await renderToString(he.decode(program.content.markdown)),
        ...program,
      },
    },
  }
}

export default ProgramPage
