import * as React from 'react'
import cx from 'classnames'

function SkeletonRow({ cells = 3, isEvenRow, ...props }) {
  return (
    <tr className="animate-pulse" {...props}>
      {Array.from(Array(cells), (_, index) => {
        return (
          <td key={index} className="px-6 py-4 whitespace-no-wrap">
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

function Table({
  canNextPage,
  canPreviousPage,
  columns,
  getTableProps,
  getTableBodyProps,
  loading,
  nextPage,
  page,
  prepareRow,
  previousPage,
  rowOnClick,
  visibleColumns
}) {
  if (!columns) return null

  return (
    <React.Fragment>
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200"
      >
        <tbody
          {...getTableBodyProps()}
          className="bg-white divide-y divide-gray-200"
        >
          {loading ? (
            <React.Fragment>
              {Array.from(Array(4), (_, index) => {
                const isEvenRow = Boolean(index % 2)

                return (
                  <SkeletonRow
                    key={index}
                    cells={visibleColumns.length}
                    isEvenRow={isEvenRow}
                    style={{
                      animationFillMode: 'backwards',
                      animationDelay: `${index * 150}ms`
                    }}
                  />
                )
              })}
            </React.Fragment>
          ) : (
            page.map((row) => {
              prepareRow(row)

              return (
                <tr
                  {...row.getRowProps()}
                  className="group"
                  {...(rowOnClick && {
                    onClick: () => rowOnClick(row.original)
                  })}
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps([
                        {
                          className: [
                            cell.column.className,
                            'px-6 py-4 whitespace-nowrap text-sm cursor-pointer'
                          ].join(' ')
                        }
                      ])}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
      {!loading ? (
        <nav
          className="border-t border-gray-200 pb-4 px-4 flex items-center justify-between"
          aria-label="Pagination"
        >
          <div className="-mt-px w-0 flex-1 flex">
            <button
              className="pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <svg
                className="mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Previous
            </button>
          </div>
          <div className="-mt-px w-0 flex-1 flex justify-end">
            <button
              className="pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              Next
              <svg
                className="ml-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </nav>
      ) : null}
    </React.Fragment>
  )
}

export default Table
