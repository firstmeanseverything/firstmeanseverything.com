import { useState } from 'react'
import Link from 'next/link'
import { GraphQLClient } from 'graphql-request'
import useSWR from 'swr'

import { useAuthState } from '../context/auth'

function ProgramList() {
  const { isAuthenticated } = useAuthState()
  const [category, setCategory] = useState('RX')

  const graphcms = new GraphQLClient(
    process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT,
    {
      headers: {
        authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN}`,
      },
    }
  )

  const date = new Date().toDateString()

  const { data, error } = useSWR(
    isAuthenticated
      ? [
          `query AvailablePrograms($category: ProgramCategory!, $date: Date!) {
            programs(where: {date_lt: $date, category: $category}) {
              date
              category
              id
              pdf {
                url
              }
            }
          }`,
          category,
          date,
        ]
      : null,
    (query, category, date) => graphcms.request(query, { category, date }),
    { revalidateOnFocus: false }
  )

  if (!isAuthenticated) return 'Nothing'

  return (
    <ul>
      {!data ? (
        <p>Loading..</p>
      ) : (
        data.programs.map((program) => (
          <li key={program.id}>
            {program.date}
            <a href={program.pdf.url} target="_blank" rel="nofollow noreferrer">
              Download
            </a>
          </li>
        ))
      )}
    </ul>
  )
}

export default ProgramList
