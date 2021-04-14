import { useRouter } from 'next/router'
import { ArrowNarrowLeftIcon } from '@heroicons/react/solid'

import { APMarkSVG } from '@/svgs'
import DaySection from '@/components/day-section'
import ProgramInfo from '@/components/program-info'

function ProgramPage({ program }) {
  const router = useRouter()

  return (
    <main className="py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
        <div className="flex items-center space-x-5">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-saffron">
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
        <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
          >
            <ArrowNarrowLeftIcon
              className="-ml-1 mr-2 h-5 w-5"
              aria-hidden="true"
            />
            Back
          </button>
        </div>
      </div>
      <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-start-1 lg:col-span-2">
          <section aria-labelledby="program-days">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2
                  id="applicant-days"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  Program Days
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  A breakdown of your weekly work.
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl className="sm:divide-y sm:divide-gray-200">
                  {[...program.days, { rest: true, title: 'Sunday' }].map(
                    DaySection
                  )}
                </dl>
              </div>
            </div>
          </section>
        </div>
        <ProgramInfo program={program} />
      </div>
    </main>
  )
}

export default ProgramPage
