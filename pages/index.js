import * as React from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import Link from 'next/link'
import cx from 'classnames'
import format from 'date-fns/format'

import Badge from '@/components/badge'
import { getProgramsList, getSampleProgramsList } from '@/lib/graphcms'
import { getProduct } from '@/lib/db-admin'
import Page from '@/components/page'
import SubscriptionCTA from '@/components/subscription-cta'
import Table from '@/ui/table'
import { useAuthState } from '@/context/auth'
import { useAuthenticatedPage } from '@/hooks/auth'
import { usePaginationQueryParams } from '@/hooks/data'
import { usePaginatedTable } from '@/hooks/table'

function Index({ preview, product }) {
  const { user } = useAuthState()
  const pagination = usePaginationQueryParams()
  const [activeCategory, setActiveCategory] = React.useState('RX')

  useAuthenticatedPage()

  const hasSubscription = user?.stripeRole === 'basic'

  const { data, error } = useSWR(
    user
      ? hasSubscription
        ? [
            getProgramsList,
            activeCategory,
            pagination.limit,
            pagination.offset,
            user.accessDate
          ]
        : [
            getSampleProgramsList,
            activeCategory,
            pagination.limit,
            pagination.offset
          ]
      : null,
    (query, activeCategory, limit, offset, accessDate) =>
      query(
        {
          category: activeCategory,
          limit: Number(limit),
          offset: Number(offset),
          to: format(new Date(), 'yyyy-MM-dd'),
          ...(hasSubscription && { from: format(accessDate, 'yyyy-MM-dd') })
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
          Cell: ({ value: { date, title } }) => (
            <div>
              <div className="font-medium text-gray-900">{title}</div>
              {date ? (
                <div className="text-gray-500">
                  {new Intl.DateTimeFormat('en-GB', {
                    dateStyle: 'full'
                  }).format(new Date(date))}
                </div>
              ) : null}
            </div>
          )
        },
        {
          id: 'bias',
          Header: 'Bias',
          accessor: 'node.bias',
          Cell: ({ value }) =>
            value ? (
              <Badge label={value} theme="green" />
            ) : (
              <React.Fragment>&mdash;</React.Fragment>
            )
        },
        {
          id: 'category',
          Header: 'Category',
          accessor: 'node.category',
          Cell: ({ value }) => <Badge label={value} theme="green" />
        },
        {
          id: 'author',
          Header: 'Author',
          accessor: 'node.createdBy',
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
                <div className="text-sm font-medium text-gray-900">
                  {value.name}
                </div>
              </div>
            </div>
          )
        },
        {
          id: 'view',
          accessor: 'node',
          Cell: ({ value: program }) => (
            <Link
              href={
                program.free
                  ? `/program/${program.category.toLowerCase()}/sample/${
                      program.id
                    }`
                  : `/program/${program.category.toLowerCase()}/${program.date}`
              }
            >
              <a className="text-gray-500 text-lg">
                <span className="sr-only">View program</span>
                <span aria-hidden="true">&rarr;</span>
              </a>
            </Link>
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

  const programCategories = [
    { label: 'RX', value: 'RX' },
    { label: 'Scaled', value: 'SCALED' }
  ]

  const HeaderControls = () => {
    return (
      <nav className="flex space-x-4">
        {programCategories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(category.value)}
            className={cx(
              'px-3 py-2 font-medium text-sm leading-5 rounded-md focus:outline-none',
              {
                'text-indigo-700 bg-indigo-100 focus:text-indigo-800 focus:bg-indigo-200':
                  activeCategory === category.value,
                'text-gray-500 hover:text-gray-700 focus:text-indigo-600 focus:bg-indigo-50':
                  activeCategory !== category.value
              }
            )}
            aria-current={activeCategory === category.value ? 'page' : 'false'}
          >
            {category.label}
          </button>
        ))}
      </nav>
    )
  }

  return (
    <Page title="Program" controls={<HeaderControls />}>
      {user && !hasSubscription && <SubscriptionCTA {...product} />}
      <div className="flex flex-col">
        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="align-middle inline-block min-w-full overflow-hidden rounded sm:rounded-lg shadow">
            <Table loading={!data} {...programTable} />
          </div>
        </div>
      </div>
    </Page>
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
