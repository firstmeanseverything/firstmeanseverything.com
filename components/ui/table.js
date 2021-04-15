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
          className="border-t border-gray-200 pb-4 px-4 flex items-center justify-between"
          aria-label="Pagination"
        >
          <div className="-mt-px w-0 flex-1 flex">
            <button
              className="pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
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
          <div className="-mt-px w-0 flex-1 flex justify-end">
            <button
              className="pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
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
