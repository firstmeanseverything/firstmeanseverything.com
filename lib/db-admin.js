import { getAuth } from 'firebase-admin/auth'

import admin from '@/lib/firebase-admin'

const validateToken = (handler) => async (req, res) => {
  try {
    if (!req.headers.authorization) throw new Error('Not authorised!')

    const decodedToken = await getAuth(admin).verifyIdToken(
      req.headers.authorization,
      true
    )

    const user = await getAuth(admin).getUser(decodedToken.uid)

    return handler(req, res, user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export { validateToken }
