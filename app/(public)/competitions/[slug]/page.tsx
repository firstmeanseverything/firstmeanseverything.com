import * as React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'

import Alert from '@/components/alert'
import Badge from '@/components/badge'
import { graphCmsSdk } from '@/graphql/client'
import { CompetitionType, Stage } from '@/graphql/sdk'

import CompetitionInfo from '../components/competition-info'
import SpectatorTickets from '../components/spectator-tickets'

interface CompetitionPageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const { competitions } = await graphCmsSdk.CompetitionsPathsQuery()

  return competitions.map(({ slug }) => slug)
}

export default async function CompetitionPage({
  params
}: CompetitionPageProps): Promise<JSX.Element> {
  const { competition } = await graphCmsSdk.CompetitionPageQuery({
    slug: params.slug,
    stage: Stage.Draft
  })

  if (!competition) notFound()

  const mdxContent = competition.content ? (
    <MDXRemote
      source={competition.content}
      components={{ Alert: Alert, SpectatorTickets: SpectatorTickets }}
      options={{ scope: { competition } }}
    />
  ) : null

  const dateRange: string = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
    ...(competition.type !== CompetitionType.Qualifiers && {
      timeStyle: 'short'
    })
  }).formatRange(new Date(competition.startDate), new Date(competition.endDate))

  return (
    <React.Fragment>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
        <div className="flex items-center space-x-5">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {competition.title}
              </h1>
              <Badge label={competition.type} theme="green" />
            </div>
            <time
              className="text-sm font-medium text-gray-500"
              dateTime={dateRange}
            >
              {dateRange}
            </time>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3 lg:px-8">
        <div className="space-y-6 lg:col-span-2 lg:col-start-1">
          <section aria-labelledby="program-days">
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
              <Image
                height={competition.header.height!}
                width={competition.header.width!}
                priority={true}
                src={competition.header.url}
                alt={`View details for ${competition.title}`}
                className="pointer-events-none object-cover group-hover:opacity-75"
              />
              <div className="px-4 py-5 sm:px-6">
                <div className="prose">{mdxContent}</div>
              </div>
            </div>
          </section>
        </div>
        <CompetitionInfo competition={{ dateRange, ...competition }} />
      </div>
    </React.Fragment>
  )
}
