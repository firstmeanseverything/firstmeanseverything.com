import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

import admin from '@/lib/firebase-admin'

const getProduct = async (productId) => {
  try {
    const snapshot = await getFirestore(admin)
      .collection('products')
      .doc(productId)
      .get()

    const pricesSnapshot = await snapshot.ref.collection('prices').get()

    const prices = []

    pricesSnapshot.forEach((price) => {
      prices.push({ id: price.id, ...price.data() })
    })

    return { product: { id: snapshot.id, prices, ...snapshot.data() } }
  } catch (error) {
    return { error }
  }
}

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

export { getProduct, validateToken }
