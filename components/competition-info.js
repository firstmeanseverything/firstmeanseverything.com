import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import cx from 'classnames'
import { ExternalLinkIcon } from '@heroicons/react/outline'

import Badge from '@/components/badge'

function CompetitionInfo({ competition }) {
  const information = React.useMemo(
    () => [
      ...(competition.dateRange
        ? [
            {
              className: 'sm:col-span-2',
              label: 'Dates',
              value: competition.dateRange
            }
          ]
        : []),
      {
        className: 'sm:col-span-1',
        label: 'Type',
        value: <Badge label={competition.type} theme="green" />
      },
      {
        className: 'sm:col-span-2',
        value: (
          <span className="block rounded-md shadow-sm">
            <Link href={competition.url}>
              <a className="focus:shadow-outline-indigo flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:border-indigo-700 focus:outline-none active:bg-indigo-700">
                <ExternalLinkIcon className="h5 mr-3 w-5" />
                Registration Open Now
              </a>
            </Link>
          </span>
        )
      }
    ],
    []
  )

  return (
    <section
      aria-labelledby="information-title"
      className="order-first lg:order-last lg:col-span-1 lg:col-start-3"
    >
      <div className="overflow-hidden bg-white shadow sm:rounded-lg lg:sticky lg:top-10">
        <div className="px-4 py-5 sm:px-6">
          <h2
            id="information-title"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Competition Details
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Key information.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-2">
            {information.map(({ className, label, value }, index) => (
              <div key={index} className={cx(className)}>
                <dt className="text-sm font-medium text-gray-500">{label}</dt>
                <dd className="mt-1 text-sm text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export default CompetitionInfo
