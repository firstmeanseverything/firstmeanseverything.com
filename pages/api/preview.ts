import type { NextApiRequest, NextApiResponse } from 'next'

import { graphCmsSdk } from '@/graphql/client'
import { Stage } from '@/graphql/sdk'

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (!req.query.id)
    return res
      .status(401)
      .json({ status: 401, message: 'No ID query parameter found' })

  const { program } = await graphCmsSdk.ProgramPreviewPageQuery({
    id: req.query.id as string,
    stage: Stage.Draft
  })

  if (!program)
    return res.status(404).json({ status: 404, message: 'Not found' })

  res.setPreviewData({})

  res.writeHead(307, {
    Location: program.free
      ? `/program/${program.category.toLowerCase()}/sample/${program.id}`
      : `/program/${program.category.toLowerCase()}/${program.date}`
  })
  res.end()
}

export default handler
