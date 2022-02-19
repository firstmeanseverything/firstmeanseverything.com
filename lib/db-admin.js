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

export { getProduct }
