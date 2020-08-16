import { useState } from 'react'
import cx from 'classnames'

function DaySection({ mdxContent, title }) {
  const [dayOpen, setDayOpen] = useState(false)

  const toggleDayOpen = () => setDayOpen((open) => !open)

  return (
    <div className="pt-6 first:pt-0">
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
        className={cx('border-t mt-6 pr-12 pt-6', {
          hidden: !dayOpen,
        })}
      >
        <div className="prose">{mdxContent}</div>
      </dd>
    </div>
  )
}

export default DaySection
