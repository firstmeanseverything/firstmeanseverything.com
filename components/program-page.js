import * as React from 'react'
import { useRouter } from 'next/router'
import { ArrowNarrowLeftIcon } from '@heroicons/react/solid'

import { APMarkSVG } from '@/svgs'
import DaySection from '@/components/day-section'
import ProgramInfo from '@/components/program-info'
import SEO from '@/components/seo'

function ProgramPage({ program }) {
  const router = useRouter()

  return (
    <React.Fragment>
      <SEO title={`${program.title} (${program.category}) - Athlete Program`} />
      <main className="py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
          <div className="flex items-center space-x-5">
            <div className="shrink-0">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-saffron">
                <APMarkSVG className="-mt-2 h-10 w-10 text-shark" />
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {program.title}
              </h1>
              {program.date ? (
                <p className="text-sm font-medium text-gray-500">
                  Week beginning{' '}
                  <time className="text-gray-900" dateTime={program.date}>
                    {new Intl.DateTimeFormat('en-GB', {
                      dateStyle: 'full'
                    }).format(new Date(program.date))}
                  </time>
                </p>
              ) : null}
            </div>
          </div>
          <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              <ArrowNarrowLeftIcon
                className="-ml-1 mr-2 h-5 w-5"
                aria-hidden="true"
              />
              Back
            </button>
          </div>
        </div>
        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3 lg:px-8">
          <div className="space-y-6 lg:col-span-2 lg:col-start-1">
            <section aria-labelledby="program-days">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2
                    id="applicant-days"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Program Days
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    A breakdown of your weekly work.
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    {program.days.map(DaySection)}
                  </dl>
                </div>
              </div>
            </section>
          </div>
          <ProgramInfo program={program} />
        </div>
      </main>
    </React.Fragment>
  )
}

export default ProgramPage
