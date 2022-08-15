import * as React from 'react'
import { MDXRemote } from 'next-mdx-remote'
import cx from 'classnames'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/outline'

import { programMdxComponents } from '@/components/mdx'
import WorkoutBlock from '@/components/workout-block'

function DaySection({ activeRecovery = false, content, title }, index) {
  const mdxContent = content ? (
    <MDXRemote {...content.mdx} components={programMdxComponents} />
  ) : null

  return (
    <Disclosure key={index} as="div">
      {({ open }) => (
        <React.Fragment>
          <dt className="px-4 py-4 text-lg leading-7 sm:py-5 sm:px-6">
            <Disclosure.Button className="flex w-full items-center justify-between text-left text-gray-400 focus:text-gray-900 focus:outline-none">
              <span className="font-medium text-gray-900">{title}</span>

              <span className="ml-6 flex h-7 items-center">
                <ChevronDownIcon
                  className={cx(
                    'h-6 w-6 transition-transform duration-100',
                    open ? '-rotate-180' : 'rotate-0'
                  )}
                />
              </span>
            </Disclosure.Button>
          </dt>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Disclosure.Panel
              static
              as="dd"
              className="border-b border-t border-gray-200 bg-gray-50 px-4 py-6 sm:border-b-0 sm:px-6 sm:py-8"
            >
              <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-6">
                {activeRecovery ? (
                  <WorkoutBlock title="Active Recovery" type="recovery">
                    {mdxContent}
                  </WorkoutBlock>
                ) : (
                  mdxContent
                )}
              </ul>
            </Disclosure.Panel>
          </Transition>
        </React.Fragment>
      )}
    </Disclosure>
  )
}

export default DaySection
