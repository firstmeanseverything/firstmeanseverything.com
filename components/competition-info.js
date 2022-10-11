import * as React from 'react'
import Link from 'next/link'
import cx from 'classnames'
import { ExternalLinkIcon, PaperClipIcon } from '@heroicons/react/outline'

import VenueMap from '@/components/venue-map'

function CompetitionInfo({ competition }) {
  const pastCompetition = new Date(competition.startDate) < new Date()

  const information = React.useMemo(
    () => [
      ...(competition.description
        ? [
            {
              className: 'sm:col-span-2',
              label: 'Description',
              value: competition.description
            }
          ]
        : []),
      ...(competition.dateRange
        ? [
            {
              className: 'sm:col-span-2',
              label: 'Dates',
              value: competition.dateRange
            }
          ]
        : []),
      ...(competition.files.length
        ? [
            {
              className: 'sm:col-span-3',
              label: 'Files',
              value: (
                <ul
                  role="list"
                  className="divide-y divide-gray-200 rounded-md border border-gray-200"
                >
                  {competition.files.map((file) => (
                    <li
                      key={file.id}
                      className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                    >
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <span className="ml-2 w-0 flex-1 truncate">
                          {file.fileName}
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href={file.url}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            }
          ]
        : []),
      {
        className: 'sm:col-span-3',
        label: 'Location',
        value: (
          <div className="space-y-8">
            <p>{competition.venue.address}</p>
            <div className="-mx-4 flex justify-center sm:-mx-6">
              <VenueMap venue={competition.venue} />
            </div>
          </div>
        )
      },
      {
        className: 'sm:col-span-3',
        value: (
          <span className="block rounded-md shadow-sm">
            <Link
              href={competition.url}
              className="focus:shadow-outline-indigo flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:border-indigo-700 focus:outline-none active:bg-indigo-700"
            >
              <ExternalLinkIcon className="h5 mr-3 w-5" />
              {pastCompetition ? 'View leaderboards' : 'Registration open now'}
            </Link>
          </span>
        )
      }
    ],
    [pastCompetition]
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
