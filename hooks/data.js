import * as React from 'react'
import { useRouter } from 'next/router'

function queryParamsReducer(state, { payload, type }) {
  switch (type) {
    case 'UPDATE':
      return { ...state, ...payload }
    default:
      throw new Error(`Unhandled action type: ${type}`)
  }
}

function usePaginationQueryParams({ limit = 25, offset = 0 } = {}) {
  const [queryParamsState, queryParamsDispatch] = React.useReducer(
    queryParamsReducer,
    {
      limit,
      offset
    }
  )
  const router = useRouter()

  React.useEffect(() => {
    queryParamsDispatch({ type: 'UPDATE', payload: router.query })
  }, [router.query])

  return queryParamsState
}

export { usePaginationQueryParams }
