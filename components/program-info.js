import * as React from 'react'
import Image from 'next/image'
import hydrate from 'next-mdx-remote/hydrate'
import cx from 'classnames'

import { AuthProvider } from '@/context/auth'
import Badge from '@/components/badge'
import mdxComponents from './mdx'

function ProgramInfo({ program }) {
  const mdxNotes = program.notes
    ? hydrate(program.notes.mdx, {
        components: mdxComponents,
        provider: { component: AuthProvider }
      })
    : null

  const information = React.useMemo(
    () => [
      ...(program.date
        ? [
            {
              className: 'sm:col-span-1',
              label: 'Published date',
              value: new Intl.DateTimeFormat('en-GB', {
                dateStyle: 'long'
              }).format(new Date(program.date))
            }
          ]
        : []),
      {
        className: 'sm:col-span-1',
        label: 'Category',
        value: <Badge label={program.category} theme="green" />
      },
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
                <div className="flex-shrink-0 block">
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
              value: <div className="prose prose-sm">{mdxNotes}</div>
            }
          ]
        : [])
    ],
    []
  )

  return (
    <section
      aria-labelledby="information-title"
      className="lg:col-start-3 lg:col-span-1 order-first lg:order-last"
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg lg:sticky lg:top-10">
        <div className="px-4 py-5 sm:px-6">
          <h2
            id="information-title"
            className="text-lg leading-6 font-medium text-gray-900"
          >
            Program Details
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Key information.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
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
