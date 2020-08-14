import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import cx from 'classnames'

import { graphcmsClient } from '../lib/graphcms'
import { getProduct } from '../lib/db-admin'
import Page from '../components/page'
import SkeletonRow from '../components/skeleton-row'
import SubscriptionCTA from '../components/subscription-cta'
import { useAuthState } from '../context/auth'

function Index({ product }) {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('RX')

  useEffect(() => {
    if (!isAuthenticating && !user) router.push('/signin')
  }, [isAuthenticating, user])

  const hasSubscription = user?.stripeRole === 'basic'

  const { data, error } = useSWR(
    user
      ? hasSubscription
        ? [
            `query AvailablePrograms($category: ProgramCategory!, $date: Date!, $free: Boolean!) {
              programs(orderBy: date_DESC, where: { date_lt: $date, category: $category, free: $free }) {
                bias
                date
                category
                free
                id
                title
              }
            }`,
            activeCategory,
            hasSubscription,
          ]
        : [
            `query AvailablePrograms($category: ProgramCategory!, $free: Boolean!) {
              programs(orderBy: createdAt_DESC, where: { category: $category, free: $free }) {
                bias
                date
                category
                free
                id
                title
              }
            }`,
            activeCategory,
            hasSubscription,
          ]
      : null,
    (query, activeCategory, hasSubscription) =>
      graphcmsClient.request(query, {
        category: activeCategory,
        date: new Date().toDateString(),
        free: !hasSubscription,
      }),
    { revalidateOnFocus: false }
  )

  const programCategories = [
    { label: 'RX', value: 'RX' },
    { label: 'Scaled', value: 'SCALED' },
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
                  activeCategory !== category.value,
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Bias
                  </th>
                  {hasSubscription && (
                    <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  )}
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!data ? (
                  <React.Fragment>
                    {Array.from(Array(4), (_, index) => {
                      const isEvenRow = Boolean(index % 2)

                      return (
                        <SkeletonRow
                          key={index}
                          cells={4}
                          style={{
                            animationFillMode: 'backwards',
                            animationDelay: `${index * 150}ms`,
                          }}
                          isEvenRow={isEvenRow}
                        />
                      )
                    })}
                  </React.Fragment>
                ) : (
                  data.programs.map((program, index) => {
                    const dateDiff = Math.floor(
                      (new Date() - new Date(program.date)) /
                        (1000 * 60 * 60 * 24)
                    )
                    const isNew = dateDiff <= 7
                    const formattedBias =
                      program.bias[0] + program.bias.slice(1).toLowerCase()

                    return (
                      <tr
                        key={program.id}
                        onClick={() =>
                          router.push(
                            program.free
                              ? '/program/[category]/sample/[id]'
                              : '/program/[category]/[date]',
                            program.free
                              ? `/program/${program.category.toLowerCase()}/sample/${
                                  program.id
                                }`
                              : `/program/${program.category.toLowerCase()}/${
                                  program.date
                                }`
                          )
                        }
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          <div className="flex items-center">
                            {!hasSubscription && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                Free
                              </span>
                            )}
                            {isNew && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                New
                              </span>
                            )}
                            <div
                              className={cx({
                                'ml-4': isNew || !hasSubscription,
                              })}
                            >
                              <div className="text-sm leading-5 font-medium text-gray-900">
                                {program.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {formattedBias}
                          </span>
                        </td>
                        {hasSubscription && (
                          <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium text-gray-900">
                            {new Intl.DateTimeFormat('en-GB', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }).format(new Date(program.date))}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {program.category}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Page>
  )
}

export async function getStaticProps() {
  const { product } = await getProduct(process.env.STRIPE_PRODUCT_ID)

  return {
    props: {
      product,
    },
  }
}

export default Index
