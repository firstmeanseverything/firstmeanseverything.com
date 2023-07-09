interface CustomError extends Error {
  info: Record<string, never>
  status: number
}

async function fetcher<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T | CustomError> {
  const { body, headers, method = 'GET', ...rest } = init || {}

  const res = await fetch(input, {
    method,
    headers: new Headers({ 'Content-Type': 'application/json', ...headers }),
    ...(body && { body }),
    ...rest
  })
  const json = await res.json()

  if (!res.ok) {
    const error = new Error(
      'An error occurred while performing this request.'
    ) as CustomError

    error.info = json
    error.status = res.status

    throw error
  }

  return json as T
}

export default fetcher
