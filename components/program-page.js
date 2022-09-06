import * as React from 'react'
import cx from 'classnames'
import { RadioGroup } from '@headlessui/react'

import { APMarkSVG } from '@/svgs'
import DaySection from '@/components/day-section'
import ProgramInfo from '@/components/program-info'
import SEO from '@/components/seo'

function ProgramPage({ programs }) {
  const [selectedProgram, setSelectedProgram] = React.useState(programs[0])

  return (
    <React.Fragment>
      <SEO
        title={`${selectedProgram.title} (${selectedProgram.category}) - Athlete Program`}
        image={{ url: process.env.NEXT_PUBLIC_OG_IMAGE_PROGRAM }}
      />
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
                {selectedProgram.title}
              </h1>
              {selectedProgram.date ? (
                <p className="text-sm font-medium text-gray-500">
                  Week beginning{' '}
                  <time
                    className="text-gray-900"
                    dateTime={selectedProgram.date}
                  >
                    {new Intl.DateTimeFormat('en-GB', {
                      dateStyle: 'full'
                    }).format(new Date(selectedProgram.date))}
                  </time>
                </p>
              ) : null}
            </div>
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
                    {selectedProgram.days.map(DaySection)}
                  </dl>
                </div>
              </div>
            </section>
          </div>
          <div className="order-first lg:order-last lg:col-span-1 lg:col-start-3">
            <div className="space-y-6 lg:sticky lg:top-10">
              <section aria-labelledby="program-category">
                <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                  <RadioGroup
                    value={selectedProgram}
                    onChange={setSelectedProgram}
                  >
                    <RadioGroup.Label className="sr-only">
                      Program category
                    </RadioGroup.Label>
                    <div className="-space-y-px rounded-md">
                      {programs.map((program, index) => (
                        <RadioGroup.Option
                          key={program.id}
                          value={program}
                          className={({ checked }) =>
                            cx(
                              index === 0
                                ? 'sm:rounded-tl-lg sm:rounded-tr-lg'
                                : '',
                              index === programs.length - 1
                                ? 'sm:rounded-bl-lg sm:rounded-br-lg'
                                : '',
                              checked
                                ? 'z-10 border-indigo-200 bg-indigo-50'
                                : 'border-gray-200',
                              'relative flex cursor-pointer border p-4 focus:outline-none'
                            )
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <span
                                className={cx(
                                  checked
                                    ? 'border-transparent bg-indigo-600'
                                    : 'border-gray-',
                                  active
                                    ? 'ring-2 ring-indigo-500 ring-offset-2'
                                    : '',
                                  'mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border'
                                )}
                                aria-hidden="true"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                              </span>
                              <span className="ml-3 flex flex-col">
                                <RadioGroup.Label
                                  as="span"
                                  className={cx(
                                    checked
                                      ? 'text-indigo-900'
                                      : 'text-gray-900',
                                    'block text-sm font-medium'
                                  )}
                                >
                                  {program.category}
                                </RadioGroup.Label>
                              </span>
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </section>
              <ProgramInfo program={selectedProgram} />
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  )
}

export default ProgramPage
