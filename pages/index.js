import * as React from 'react'
import useSWR from 'swr'
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
          limit,
          offset,
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
          Header: 'Title',
          accessor: 'node.title'
        },
        {
          id: 'bias',
          Header: 'Bias',
          accessor: 'node.bias',
          Cell: ({ value }) => <Badge label={value} theme="green" />
        },
        {
          id: 'date',
          Header: 'Date',
          accessor: 'node.date',
          Cell: ({ value }) =>
            new Intl.DateTimeFormat('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }).format(new Date(value))
        },
        {
          id: 'category',
          Header: 'Category',
          accessor: 'node.category',
          Cell: ({ value }) => <Badge label={value} theme="green" />
        }
      ],
      []
    ),
    data: data?.programs.edges,
    initialState: {
      hiddenColumns: ['date']
    },
    pagination: {
      totalPages:
        Math.ceil(data?.programs.aggregate.count / pagination.limit) || null,
      ...pagination
    }
  })

  React.useEffect(() => {
    if (hasSubscription) setHiddenColumns([])
  }, [hasSubscription])

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

export async function getStaticProps({ preview }) {
  const { product } = await getProduct(process.env.STRIPE_PRODUCT_ID)

  return {
    props: {
      preview,
      product
    }
  }
}

export default Index
