import * as React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import Image from 'next/image'
import cx from 'classnames'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import { ChevronRightIcon } from '@heroicons/react/solid'

import { APMarkSVG } from '@/components/svgs'
import Badge from '@/components/badge'
import { getProgramsList } from '@/lib/graphcms'
import { getProduct } from '@/lib/db-admin'
import { ProgramsListQuery, SampleProgramsListQuery } from '@/queries/program'
import SEO from '@/components/seo'
import SubscriptionCTA from '@/components/subscription-cta'
import Table from '@/ui/table'
import { useAuthState } from '@/context/auth'
import { useAuthenticatedPage } from '@/hooks/auth'
import { usePaginationQueryParams } from '@/hooks/data'
import { usePaginatedTable } from '@/hooks/table'

function Index({ preview, product }) {
  const { isAuthenticating, user, userHasSubscription } = useAuthState()
  const pagination = usePaginationQueryParams()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = React.useState('rx')

  useAuthenticatedPage()

  const showSubscriptionCta =
    !(isAuthenticating || userHasSubscription) &&
    ['rx', 'scaled'].includes(activeCategory)

  const { data, error } = useSWR(
    user
      ? activeCategory === 'samples'
        ? [
            SampleProgramsListQuery,
            activeCategory,
            pagination.limit,
            pagination.offset
          ]
        : userHasSubscription
        ? [
            ProgramsListQuery,
            activeCategory,
            pagination.limit,
            pagination.offset
          ]
        : null
      : null,
    (query, activeCategory, limit, offset) =>
      getProgramsList(
        query,
        {
          limit: Number(limit),
          offset: Number(offset),
          ...(userHasSubscription && {
            category: activeCategory.toUpperCase(),
            from: format(user.accessDate, 'yyyy-MM-dd'),
            to: format(addDays(new Date(), 1), 'yyyy-MM-dd')
          })
        },
        preview
      ),
    { revalidateOnFocus: false }
  )

  const { setHiddenColumns, ...programTable } = usePaginatedTable({
    columns: React.useMemo(
      () => [
        {
          id: 'title',
          accessor: ({ node }) => ({
            date: node?.date,
            title: node.title
          }),
          className: 'max-w-0 w-full',
          Cell: ({ value: { date, title } }) => (
            <div>
              <p className="text-sm font-medium text-gray-900">{title}</p>
              {date ? (
                <p className="text-sm text-gray-500">
                  {new Intl.DateTimeFormat('en-GB', {
                    dateStyle: 'full'
                  }).format(new Date(date))}
                </p>
              ) : null}
            </div>
          )
        },
        {
          id: 'bias',
          accessor: 'node.bias',
          className: 'hidden md:table-cell',
          Cell: ({ value }) =>
            value ? (
              <Badge label={value} theme="green" />
            ) : (
              <React.Fragment>&mdash;</React.Fragment>
            )
        },
        {
          id: 'category',
          accessor: 'node.category',
          Cell: ({ value }) => <Badge label={value} theme="green" />
        },
        {
          id: 'author',
          accessor: 'node.createdBy',
          className: 'hidden md:table-cell',
          Cell: ({ value }) => (
            <div className="flex items-center">
              <div className="flex-shrink-0 relative h-10 w-10">
                <Image
                  className="rounded-full"
                  src={value.picture}
                  layout="fill"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {value.name}
                </p>
              </div>
            </div>
          )
        },
        {
          id: 'icon',
          className: 'text-gray-500 group-hover:text-gray-700',
          Cell: () => (
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          )
        }
      ],
      []
    ),
    data: data?.programs.edges,
    pagination: {
      totalPages:
        Math.ceil(data?.programs.aggregate.count / pagination.limit) || null,
      ...pagination
    }
  })

  React.useEffect(() => {
    return setActiveCategory(router.query.category ?? 'rx')
  }, [router.query.category])

  React.useEffect(() => {
    if (activeCategory === 'samples') return setHiddenColumns([])

    return setHiddenColumns(['category'])
  }, [activeCategory])

  const viewProgram = ({ node: program }) =>
    program.free
      ? router.push(
          `/program/${program.category.toLowerCase()}/sample/${program.id}`
        )
      : router.push(
          `/program/${program.category.toLowerCase()}/${program.date}`
        )

  return (
    <React.Fragment>
      <SEO title="Athlete Program" />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:px-8">
          <div className="flex items-center space-x-5">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-saffron">
                <APMarkSVG className="-mt-2 h-10 w-10 text-shark" />
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Athlete Program
              </h1>
            </div>
          </div>
          <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3"></div>
        </div>
        <div className="mt-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
          <section>
            <div className="bg-white shadow sm:rounded-lg">
              <div className="border-b border-gray-200 px-4 sm:px-0">
                <div className="py-4 sm:hidden">
                  <label htmlFor="tabs" className="sr-only">
                    Select a tab
                  </label>
                  <select
                    id="tabs"
                    name="tabs"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-shark focus:border-shark sm:text-sm rounded-md"
                    value={activeCategory}
                    onChange={(e) =>
                      router.push({
                        pathname: router.pathname,
                        query: { ...router.query, category: e.target.value }
                      })
                    }
                  >
                    <option value="rx">RX</option>
                    <option value="scaled">Scaled</option>
                    <option value="samples">Free Samples</option>
                  </select>
                </div>
                <div className="hidden sm:block">
                  <div className="sm:px-4">
                    <nav className="mt-2 -mb-px flex space-x-8">
                      <Link
                        href={{
                          pathname: router.pathname,
                          query: { ...router.query, category: 'rx' }
                        }}
                      >
                        <a
                          className={cx(
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                            activeCategory === 'rx'
                              ? 'border-saffron text-shark'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                          )}
                        >
                          RX
                        </a>
                      </Link>
                      <Link
                        href={{
                          pathname: router.pathname,
                          query: { ...router.query, category: 'scaled' }
                        }}
                      >
                        <a
                          className={cx(
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                            activeCategory === 'scaled'
                              ? 'border-saffron text-shark'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                          )}
                        >
                          Scaled
                        </a>
                      </Link>
                      <Link
                        href={{
                          pathname: router.pathname,
                          query: { ...router.query, category: 'samples' }
                        }}
                      >
                        <a
                          className={cx(
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                            activeCategory === 'samples'
                              ? 'border-saffron text-shark'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                          )}
                        >
                          Free Samples
                        </a>
                      </Link>
                    </nav>
                  </div>
                </div>
              </div>
              <div className="align-middle inline-block min-w-full border-b border-gray-200">
                {showSubscriptionCta ? (
                  <SubscriptionCTA {...product} />
                ) : (
                  <Table
                    loading={!data}
                    rowOnClick={viewProgram}
                    {...programTable}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </React.Fragment>
  )
}

export async function getStaticProps({ preview = false }) {
  const { product } = await getProduct(process.env.STRIPE_PRODUCT_ID)

  return {
    props: {
      preview: process.env.NODE_ENV === 'development' ? true : preview,
      product
    }
  }
}

export default Index
