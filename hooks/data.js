import * as React from 'react'
import { useRouter } from 'next/router'

function usePaginationQueryParams() {
  const { query } = useRouter()
  const [limit, setLimit] = React.useState(25)
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    if (query?.limit) setLimit(Number(query.limit))
    if (query?.offset) setOffset(Number(query.offset))
  }, [query.limit, query.offset])

  return { limit, offset }
}

export { usePaginationQueryParams }
