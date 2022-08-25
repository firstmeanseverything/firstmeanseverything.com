interface Fetcher {
  body: any
  headers?: any
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  url: string
}

interface CustomError extends Error {
  info: Record<string, never>
  status: number
}

async function fetcher<T>(props: Fetcher): Promise<T> {
  const { body, headers, method = 'GET', url } = props

  const res = await fetch(url, {
    method,
    headers: new Headers({ 'Content-Type': 'application/json', ...headers }),
    ...(body && { body: JSON.stringify(body) })
  })

  if (!res.ok) {
    const error = new Error(
      'An error occurred while performing this request.'
    ) as CustomError

    error.info = await res.json()
    error.status = res.status

    throw error
  }

  return res.json()
}

export default fetcher
