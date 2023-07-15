import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.clearPreviewData()

  res.writeHead(307, { Location: '/' })
  res.end()
}

export default handler
