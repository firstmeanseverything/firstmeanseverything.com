import { getProgramPreviewPage } from '@/lib/graphcms'

async function handler(req, res) {
  if (!req.query.id)
    return res
      .status(401)
      .json({ status: 401, message: 'No ID query parameter found' })

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
