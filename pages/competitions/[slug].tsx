import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import type { Competition as BaseCompetition } from '@/graphql/sdk'

import * as React from 'react'
import he from 'he'
import Image from 'next/image'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'

import Badge from '@/components/badge'
import CompetitionInfo from '@/components/competition-info'
import { competitionMdxComponents } from '@/components/mdx'
import SEO from '@/components/seo'
import { graphCmsSdk } from '@/graphql/client'
import { Stage } from '@/graphql/sdk'

type Competition = BaseCompetition & {
  dateRange: string
  content: { mdx: MDXRemoteSerializeResult }
}

interface CompetitionPage {
  competition: Competition
}

const CompetitionPage: NextPage<CompetitionPage> = ({ competition }) => {
  const mdxContent = competition.content ? (
    <MDXRemote
      {...competition.content.mdx}
      components={competitionMdxComponents}
      scope={{ competition }}
    />
  ) : null

  return (
    <React.Fragment>
      <SEO
        title={competition.title}
        image={competition.header}
        description={competition.description}
      />
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
              dateTime={competition.dateRange}
            >
              {competition.dateRange}
            </time>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3 lg:px-8">
        <div className="space-y-6 lg:col-span-2 lg:col-start-1">
          <section aria-labelledby="program-days">
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
              <Image
                height={competition.header.height}
                width={competition.header.width}
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
        <CompetitionInfo competition={competition} />
      </div>
    </React.Fragment>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { competitions } = await graphCmsSdk.CompetitionsPathsQuery()

  const paths = competitions.map(({ slug }) => ({
    params: {
      slug
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false
}) => {
  const stage: Stage = preview ? Stage.Draft : Stage.Published

  const { competition } = await graphCmsSdk.CompetitionPageQuery({
    slug: params.slug as string,
    stage: process.env.NODE_ENV === 'development' ? Stage.Draft : stage
  })

  const { content, ...rest } = competition

  return {
    props: {
      competition: {
        dateRange: new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'long',
          ...(rest.type !== 'QUALIFIERS' && { timeStyle: 'short' })
        }).formatRange(new Date(rest.startDate), new Date(rest.endDate)),
        content: {
          mdx: await serialize(he.decode(content)),
          markdown: content
        },
        ...rest
      }
    },
    revalidate: 10
  }
}

export default CompetitionPage
