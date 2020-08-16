import { useState } from 'react'
import hydrate from 'next-mdx-remote/hydrate'
import cx from 'classnames'

import mdxComponents from './mdx'
import WorkoutBlock from './workout-block'

function DaySection({ activeRecovery, content, id, title }, index) {
  const [dayOpen, setDayOpen] = useState(index === 0)

  const toggleDayOpen = () => setDayOpen((open) => !open)

  const mdxContent = hydrate(content.mdx, mdxComponents)

  return (
    <div key={id} className="pt-6 first:pt-0">
      <dt className="text-2xl leading-7">
        <button
          onClick={() => toggleDayOpen()}
          className="text-left w-full flex justify-between items-start text-gray-400 focus:outline-none focus:text-gray-900"
        >
          <span className="font-medium text-gray-900">{title}</span>
          <span className="ml-6 h-7 flex items-center">
            <svg
              className={cx('h-6 w-6 transform', {
                '-rotate-180': dayOpen,
                'rotate-0': !dayOpen,
              })}
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
        </button>
      </dt>
      <dd
        className={cx('border-t mt-6 pr-12 pt-6 space-y-6', {
          hidden: !dayOpen,
        })}
      >
        {activeRecovery ? (
          <WorkoutBlock title="Active Recovery">{mdxContent}</WorkoutBlock>
        ) : (
          mdxContent
        )}
      </dd>
    </div>
  )
}

export default DaySection
