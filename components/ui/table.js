import * as React from 'react'
import cx from 'classnames'
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon
} from '@heroicons/react/solid'

function SkeletonRow({ cells = 3, isEvenRow, ...props }) {
  return (
    <tr className="animate-pulse" {...props}>
      {Array.from(Array(cells), (_, index) => {
        return (
          <td key={index} className="whitespace-no-wrap px-6 py-4">
            <div className="flex">
              <div className="flex min-w-0 flex-1 flex-col space-y-1.5">
                <div
                  className={cx('rounded bg-gray-100', {
                    'h-4 w-1/3': isEvenRow,
                    'h-3 w-3/5': !isEvenRow
                  })}
                />
                <div
                  className={cx({
                    'h-3 w-1/2': isEvenRow,
                    'h-4 w-2/5': !isEvenRow
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
          className="divide-y divide-gray-200 bg-white"
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
                            'px-6 py-4 whitespace-nowrap cursor-pointer'
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
          className="flex items-center justify-between border-t border-gray-200 px-4 pb-4"
          aria-label="Pagination"
        >
          <div className="-mt-px flex w-0 flex-1">
            <button
              className="inline-flex items-center pt-4 pr-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <ArrowNarrowLeftIcon
                className="mr-3 h-5 w-5"
                aria-hidden="true"
              />
              Previous
            </button>
          </div>
          <div className="-mt-px flex w-0 flex-1 justify-end">
            <button
              className="inline-flex items-center pt-4 pl-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              Next
              <ArrowNarrowRightIcon
                className="ml-3 h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
        </nav>
      ) : null}
    </React.Fragment>
  )
}

export default Table
