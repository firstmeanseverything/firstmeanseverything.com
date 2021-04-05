import * as React from 'react'
import { useRouter } from 'next/router'
import { usePagination, useTable } from 'react-table'

function usePaginatedTable({
  columns = [],
  data,
  initialState,
  pagination,
  ...rest
} = {}) {
  if (!(columns && pagination)) return null

  const router = useRouter()

  const table = useTable(
    {
      columns,
      data: React.useMemo(() => (data ? data : []), [data]),
      initialState: {
        pageIndex: Math.ceil(pagination.offset / pagination.limit),
        pageSize: pagination.limit,
        ...initialState
      },
      useControlledState: (state) =>
        React.useMemo(
          () => ({
            ...state,
            pageIndex: Math.ceil(pagination.offset / pagination.limit)
          }),
          [state, pagination]
        ),
      manualPagination: true,
      pageCount: pagination.totalPages,
      ...rest
    },
    usePagination
  )

  const previousPage = () => {
    const offset = table.state.pageIndex - 1 * table.state.pageSize

    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        offset
      }
    })
  }

  const nextPage = () => {
    const offset = table.state.pageIndex + 1 * table.state.pageSize

    router.replace({
      pathname: router.pathname,
      query: { ...router.query, offset }
    })
  }

  return { ...table, nextPage, previousPage }
}

export { usePaginatedTable }
