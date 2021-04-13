import * as React from 'react'
import hydrate from 'next-mdx-remote/hydrate'
import cx from 'classnames'

import { AuthProvider } from '@/context/auth'
import Badge from './badge'
import mdxComponents from './mdx'
import WorkoutBlock from './workout-block'

function DaySection(
  { activeRecovery = false, content, rest = false, title },
  index
) {
  const [dayOpen, setDayOpen] = React.useState(index === 0)

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
          {...(!rest && { onClick: () => toggleDayOpen() })}
          className={cx(
            'text-left w-full flex justify-between items-center text-gray-400 focus:outline-none focus:text-gray-900',
            {
              'cursor-default': rest
            }
          )}
        >
          <span className="font-medium text-gray-900">{title}</span>
          {rest ? (
            <Badge label="Rest" theme="green" />
          ) : (
            <span className="ml-6 h-7 flex items-center">
              <svg
                className={cx(
                  'h-6 w-6 transform transition-transform duration-100',
                  {
                    '-rotate-180': dayOpen,
                    'rotate-0': !dayOpen
                  }
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          )}
        </button>
      </dt>
      {!rest && (
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
              <WorkoutBlock title="Active Recovery">{mdxContent}</WorkoutBlock>
            ) : (
              mdxContent
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DaySection
