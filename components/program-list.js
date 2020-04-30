import { useState } from 'react'
import Link from 'next/link'
import { GraphQLClient } from 'graphql-request'
import useSWR from 'swr'

import { useAuthState } from '../context/auth'

function ProgramList() {
  const { isAuthenticated } = useAuthState()
  const [category, setCategory] = useState('RX')

  const graphcms = new GraphQLClient(process.env.GRAPHCMS_ENDPOINT, {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`,
    },
  })

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
            <Link href={program.pdf.url}>Download</Link>
          </li>
        ))
      )}
    </ul>
  )
}

export default ProgramList
