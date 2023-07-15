import type { GetStaticProps, NextPage } from 'next'

import * as React from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Image from 'next/image'
import { ChevronRightIcon } from '@heroicons/react/solid'
import Stripe from 'stripe'
import cx from 'classnames'

import { APMarkSVG } from '@/components/svgs'
import Badge from '@/components/badge'
import SEO from '@/components/seo'
import SubscriptionCTA from '@/components/subscription-cta'
import Table from '@/ui/table'
import { useAuthState } from '@/context/auth'
import { usePaginationQueryParams } from '@/hooks/data'
import { usePaginatedTable } from '@/hooks/table'
import { graphCmsSdk } from '@/graphql/client'
import { ProgramCategory, Stage } from '@/graphql/sdk'

interface IndexPage {
  preview: boolean
  price: Stripe.Price
}

const Index: NextPage<IndexPage> = ({ preview, price }) => {
  const { isAuthenticating, user, userHasSubscription } = useAuthState()
  const pagination = usePaginationQueryParams()
  const router = useRouter()

  const showSubscriptionCta = !(isAuthenticating || userHasSubscription)

  const { data, error } = useSWR<any>(
    !isAuthenticating
      ? [userHasSubscription, pagination.limit, pagination.offset]
      : null,
    (userHasSubscription, limit, offset) =>
      graphCmsSdk.ProgramsListQuery({
        stage: preview ? Stage.Draft : Stage.Published,
        limit: Number(limit),
        offset: Number(offset),
        ...(userHasSubscription
          ? {
              where: {
                OR: [
                  { category: ProgramCategory.Rx, date_gte: user.accessDate },
                  { category: ProgramCategory.Rx, test: true }
                ]
              }
            }
          : { where: { free: true, category: ProgramCategory.Rx } })
      }),
    {
      revalidateOnFocus: false
    }
  )
  console.log(data)

  const { setHiddenColumns, ...programTable } = usePaginatedTable({
    initialState: {
      hiddenColumns: ['bias', 'author']
    },
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
          id: 'author',
          accessor: 'node.createdBy',
          className: 'hidden md:table-cell',
          Cell: ({ value }) => (
            <div className="flex items-center">
              <div className="relative h-10 w-10 shrink-0">
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

  const viewProgram = ({ node: program }) =>
    program.free
      ? router.push(`/program/sample/${program.bias.toLowerCase()}`)
      : router.push(`/program/${program.date}`)

  return (
    <React.Fragment>
      <SEO
        title="Athlete Program"
        image={{ url: process.env.NEXT_PUBLIC_OG_IMAGE_PROGRAM }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:px-8">
        <div className="flex items-center space-x-5">
          <div className="shrink-0">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-saffron">
              <APMarkSVG className="-mt-2 h-10 w-10 text-shark" />
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Athlete Program
            </h1>
          </div>
        </div>
        <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3"></div>
      </div>
      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 sm:px-6 lg:grid-flow-col-dense lg:grid-cols-3 lg:px-8">
        {showSubscriptionCta && (
          <div className="lg:col-span-1 lg:col-start-3">
            <SubscriptionCTA price={price} />
          </div>
        )}
        <div
          className={cx(
            'space-y-6 lg:col-start-1',
            showSubscriptionCta ? 'lg:col-span-2' : 'lg:col-span-3'
          )}
        >
          <section>
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="inline-block min-w-full border-b border-gray-200 align-middle">
                <Table
                  loading={!data}
                  rowOnClick={viewProgram}
                  {...programTable}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </React.Fragment>
  )
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-08-01'
  })

  const price = await stripe.prices.retrieve(
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
    {
      expand: ['product']
    }
  )

  return {
    props: {
      preview: process.env.NODE_ENV === 'development' ? true : preview,
      price
    }
  }
}

export default Index
