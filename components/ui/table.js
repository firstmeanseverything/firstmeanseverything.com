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
  headerGroups,
  loading,
  nextPage,
  page,
  prepareRow,
  previousPage,
  visibleColumns
}) {
  if (!columns) return null

  return (
    <React.Fragment>
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200"
      >
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  scope="col"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
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
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm"
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
          className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
          aria-label="Pagination"
        >
          <div className="flex-1 flex justify-between sm:justify-end">
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              Previous
            </button>
            <button
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              Next
            </button>
          </div>
        </nav>
      ) : null}
    </React.Fragment>
  )
}

export default Table
