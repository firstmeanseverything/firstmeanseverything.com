import type { Metadata } from 'next'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import Badge from '@/components/badge'
import { graphCmsSdk } from '@/graphql/client'
import { Stage } from '@/graphql/sdk'

export const metadata: Metadata = {
  title: 'Competitions'
}

export default async function Competitions(): Promise<JSX.Element> {
  const { competitions } = await graphCmsSdk.CompetitionsListQuery({
    stage:
      process.env.NODE_ENV === 'development' ? Stage.Draft : Stage.Published
  })

  return (
    <React.Fragment>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:px-8">
        <div className="flex items-center space-x-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Competitions</h1>
          </div>
        </div>
        <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3"></div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul
          role="list"
          className="grid gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8"
        >
          {competitions.edges.map(
            ({ node: { endDate, startDate, ...competition } }) => {
              const dateRange: string = new Intl.DateTimeFormat('en-GB', {
                dateStyle: 'long'
              }).formatRange(new Date(startDate), new Date(endDate))

              return (
                <li key={competition.id} className="relative">
                  <div className="aspect-w-10 aspect-h-7 group block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                    <Image
                      height={competition.header.height as number}
                      width={competition.header.width as number}
                      priority={true}
                      src={competition.header.url}
                      alt={`View details for ${competition.title}`}
                      className="pointer-events-none object-cover group-hover:opacity-75"
                    />
                    <Link
                      href={`/competitions/${competition.slug}`}
                      className="absolute inset-0 focus:outline-none"
                    >
                      <span className="sr-only">
                        View details for {competition.title}
                      </span>
                    </Link>
                  </div>
                  <div className="mt-2 flex items-center justify-between space-x-2">
                    <p className="pointer-events-none block truncate text-sm font-medium text-gray-900">
                      {competition.title}
                    </p>
                    <Badge
                      label={competition.type}
                      size="small"
                      theme="green"
                    />
                  </div>
                  <p className="pointer-events-none block text-sm font-medium text-gray-500">
                    {dateRange}
                  </p>
                </li>
              )
            }
          )}
        </ul>
      </div>
    </React.Fragment>
  )
}