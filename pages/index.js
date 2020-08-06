import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import cx from 'classnames'

import { graphcmsClient } from '../lib/graphcms'
import { useAuthState } from '../context/auth'

function Index() {
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
                date
                category
                free
                id
              }
            }`,
            activeCategory,
            hasSubscription,
          ]
        : [
            `query AvailablePrograms($category: ProgramCategory!, $free: Boolean!) {
              programs(orderBy: createdAt_DESC, where: { category: $category, free: $free }) {
                date
                category
                free
                id
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

  return (
    <div className="flex flex-col">
      <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="align-middle inline-block min-w-full overflow-hidden border border-gray-200 rounded shadow-sm">
          <div className="bg-white px-4 py-3 flex items-center justify-between sm:px-6">
            <nav className="flex space-x-4">
              {programCategories.map((category, index) => (
                <button
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
                  aria-current={
                    activeCategory === category.value ? 'page' : 'false'
                  }
                  key={index}
                >
                  {category.label}
                </button>
              ))}
            </nav>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="border-t border-gray-200">
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  {hasSubscription ? 'Date' : 'Title'}
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!data ? (
                <tr>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"></td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"></td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"></td>
                </tr>
              ) : (
                data.programs.map((program, index) => {
                  const dateDiff = Math.floor(
                    (new Date() - new Date(program.date)) /
                      (1000 * 60 * 60 * 24)
                  )

                  const isNew = dateDiff <= 100

                  return (
                    <tr key={program.id}>
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
                              {hasSubscription
                                ? new Intl.DateTimeFormat('en-GB', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  }).format(new Date(program.date))
                                : `Sample week ${index + 1}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {program.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                        <Link
                          href={
                            hasSubscription
                              ? '/program/[category]/[date]'
                              : '/program/[category]/sample/[id]'
                          }
                          as={
                            hasSubscription
                              ? `/program/${program.category.toLowerCase()}/${
                                  program.date
                                }`
                              : `/program/${program.category.toLowerCase()}/sample/${
                                  program.id
                                }`
                          }
                        >
                          <a
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View"
                          >
                            View
                          </a>
                        </Link>
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
  )
}

export default Index
