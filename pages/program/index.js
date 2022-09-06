import * as React from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Image from 'next/image'
import { ChevronRightIcon } from '@heroicons/react/solid'
import Stripe from 'stripe'

import { APMarkSVG } from '@/components/svgs'
import Badge from '@/components/badge'
import { getProgramsList } from '@/lib/graphcms'
import { ProgramsListQuery } from '@/queries/program'
import SEO from '@/components/seo'
import SubscriptionCTA from '@/components/subscription-cta'
import Table from '@/ui/table'
import { useAuthState } from '@/context/auth'
import { usePaginationQueryParams } from '@/hooks/data'
import { usePaginatedTable } from '@/hooks/table'

function Index({ preview, price }) {
  const { isAuthenticating, user, userHasSubscription } = useAuthState()
  const pagination = usePaginationQueryParams()
  const router = useRouter()

  const showSubscriptionCta = !(isAuthenticating || userHasSubscription)

  const { data, error } = useSWR(
    user
      ? userHasSubscription
        ? [ProgramsListQuery, pagination.limit, pagination.offset]
        : null
      : null,
    (query, limit, offset) =>
      getProgramsList(
        query,
        {
          limit: Number(limit),
          offset: Number(offset),
          from: user.accessDate
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
    router.push(`/program/${program.date}`)

  return (
    <React.Fragment>
      <SEO
        title="Athlete Program"
        image={{ url: process.env.NEXT_PUBLIC_OG_IMAGE_PROGRAM }}
      />
      <main className="py-10">
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
        <div className="mx-auto mt-8 max-w-7xl sm:px-6 lg:px-8">
          <section>
            <div className="overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="inline-block min-w-full border-b border-gray-200 align-middle">
                {showSubscriptionCta ? (
                  <SubscriptionCTA price={price} />
                ) : (
                  <Table
                    loading={!data}
                    rowOnClick={viewProgram}
                    {...programTable}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </React.Fragment>
  )
}

export async function getStaticProps({ preview = false }) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
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
