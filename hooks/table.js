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
      manualPagination: true,
      pageCount: pagination.totalPages,
      ...rest
    },
    usePagination
  )

  React.useEffect(() => {
    const offset = table.state.pageIndex * table.state.pageSize

    if (offset === pagination.offset) return

    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        offset
      }
    })
  }, [table.state.pageIndex])

  React.useEffect(() => {
    if (table.state.pageSize === pagination.limit) return

    router.replace({
      pathname: router.pathname,
      query: { ...router.query, limit: table.state.pageSize }
    })
  }, [table.state.pageSize])

  return table
}

export { usePaginatedTable }
