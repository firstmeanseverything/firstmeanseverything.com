import Badge from './badge'

function ProgramMeta({ bias, category, date }) {
  return (
    <React.Fragment>
      <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
        <Badge label={category} theme="green" />
      </div>
      <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
        <svg
          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
        {date &&
          new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date(date))}
      </div>
      <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
        <svg
          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        {bias}
      </div>
    </React.Fragment>
  )
}

export default ProgramMeta
