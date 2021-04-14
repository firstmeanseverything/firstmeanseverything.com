import * as React from 'react'
import hydrate from 'next-mdx-remote/hydrate'
import cx from 'classnames'
import { ChevronDownIcon } from '@heroicons/react/outline'

import { AuthProvider } from '@/context/auth'
import mdxComponents from './mdx'
import WorkoutBlock from './workout-block'

function DaySection({ activeRecovery = false, content, title }) {
  const [dayOpen, setDayOpen] = React.useState(false)

  const toggleDayOpen = () => setDayOpen((open) => !open)

  const mdxContent = content
    ? hydrate(content.mdx, {
        components: mdxComponents,
        provider: { component: AuthProvider }
      })
    : null

  return (
    <div key={title}>
      <dt className="px-4 py-4 text-lg leading-7 sm:py-5 sm:px-6">
        <button
          onClick={() => toggleDayOpen()}
          className="text-left w-full flex justify-between items-center text-gray-400 focus:outline-none focus:text-gray-900"
        >
          <span className="font-medium text-gray-900">{title}</span>
          <span className="ml-6 h-7 flex items-center">
            <ChevronDownIcon
              className={cx(
                'h-6 w-6 transform transition-transform duration-100',
                {
                  '-rotate-180': dayOpen,
                  'rotate-0': !dayOpen
                }
              )}
            />
          </span>
        </button>
      </dt>
      <div
        className={cx(
          'border-b border-t border-gray-200 bg-gray-50 px-4 py-6 sm:border-b-0 sm:px-6 sm:py-8',
          {
            hidden: !dayOpen
          }
        )}
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
      </div>
    </div>
  )
}

export default DaySection
