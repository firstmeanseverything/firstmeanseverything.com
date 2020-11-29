import cx from 'classnames'

function SkeletonRow({ cells = 3, isEvenRow, ...props }) {
  return (
    <tr className="animate-pulse" {...props}>
      {Array.from(Array(cells), (_, index) => {
        return (
          <td
            key={index}
            className="px-6 py-4 whitespace-no-wrap border-b border-gray-200"
          >
            <div className="flex">
              <div className="flex flex-col flex-1 min-w-0 space-y-1.5">
                <div
                  className={cx('rounded bg-gray-100', {
                    'w-1/3 h-4': isEvenRow,
                    'w-3/5 h-3': !isEvenRow
                  })}
                />
                <div
                  className={cx({
                    'w-1/2 h-3': isEvenRow,
                    'w-2/5 h-4': !isEvenRow
                  })}
                >
                  <div className="h-full rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </td>
        )
      })}
    </tr>
  )
}

export default SkeletonRow
