import { getProgramPreviewPage } from '@/lib/graphcms'

async function handler(req, res) {
  if (
    !(req.query.secret === process.env.GRAPHCMS_PREVIEW_TOKEN || req.query.id)
  )
    return res.status(401).json({ message: 'Invalid token' })

  const { program } = await getProgramPreviewPage(req.query.id)

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
