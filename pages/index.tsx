import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/future/image'

import { getCompetitionsList } from '@/lib/graphcms'

interface CompetitionPage {
  competitions: any
}

const Competitions: NextPage<CompetitionPage> = ({ competitions }) => {
  return (
    <main className="py-10">
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
          {competitions.map((competition) => (
            <li key={competition.id} className="relative">
              <div className="aspect-w-10 aspect-h-7 group block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                <Image
                  height={competition.header.height}
                  width={competition.header.width}
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
              <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                {competition.title}
              </p>
              <p className="pointer-events-none block text-sm font-medium text-gray-500">
                {competition.dateRange}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const { competitions } = await getCompetitionsList(
    { type: 'FINALS' },
    preview
  )

  return {
    props: {
      competitions: competitions.edges.map(({ node: competition }) => ({
        dateRange: new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'long',
          timeStyle: 'short'
        }).formatRange(
          new Date(competition.startDate),
          new Date(competition.endDate)
        ),
        ...competition
      }))
    }
  }
}

export default Competitions
