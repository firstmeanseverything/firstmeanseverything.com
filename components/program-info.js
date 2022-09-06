import * as React from 'react'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote'
import cx from 'classnames'

import Badge from '@/components/badge'
import { programMdxComponents } from '@/components/mdx'

function ProgramInfo({ program }) {
  const information = React.useMemo(
    () => [
      ...(program.date
        ? [
            {
              className: 'sm:col-span-1',
              label: 'Dates',
              value: program.dateRange
            }
          ]
        : []),
      {
        className: 'sm:col-span-1',
        label: 'Bias',
        value: program.bias ? (
          <Badge label={program.bias} theme="green" />
        ) : (
          <React.Fragment>&mdash;</React.Fragment>
        )
      },
      ...(program.createdBy
        ? [
            {
              className: 'sm:col-span-2',
              label: 'Programmer',
              value: (
                <div className="block shrink-0">
                  <div className="flex items-center">
                    <div className="relative h-9 w-9">
                      <Image
                        className="rounded-full"
                        src={program.createdBy.picture}
                        layout="fill"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">
                        {program.createdBy.name}
                      </p>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        : []),
      ...(program.notes
        ? [
            {
              className: 'sm:col-span-2',
              label: 'Notes',
              value: (
                <div className="prose prose-sm">
                  {program.notes ? (
                    <MDXRemote
                      {...program.notes.mdx}
                      components={programMdxComponents}
                    />
                  ) : null}
                </div>
              )
            }
          ]
        : [])
    ],
    []
  )

  return (
    <section aria-labelledby="information-title">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2
            id="information-title"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Program Details
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

export default ProgramInfo
