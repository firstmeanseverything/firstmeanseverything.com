import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc
} from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

import firebase from '@/lib/firebase'

const db = getFirestore(firebase)
const functions = getFunctions(firebase, 'europe-west2')

const createCheckoutSession = async (uid, price) => {
  const checkoutSessionRef = await addDoc(
    collection(doc(db, 'users', uid), 'checkout_sessions'),
    {
      price,
      allow_promotion_codes: true,
      success_url: window.location.origin,
      cancel_url: window.location.origin
    }
  )

  onSnapshot(checkoutSessionRef, async (doc) => {
    const { url } = doc.data()

    if (url) {
      window.location.assign(url)
    }
  })
}

const createUser = (uid, data) =>
  setDoc(doc(db, 'users', uid), { uid, ...data }, { merge: true })

const getAllUserSubscriptions = async (uid) => {
  const querySnapshot = await getDocs(
    collection(doc(db, 'users', uid), 'subscriptions')
  )

  if (querySnapshot.empty) return { subscriptions: null }

  let subscriptions = []

  querySnapshot.forEach((doc) =>
    subscriptions.push({ id: doc.id, ...doc.data() })
  )

  return {
    subscriptions
  }
}

const goToBillingPortal = async () => {
  const billingPortalSession = httpsCallable(
    functions,
    'ext-firestore-stripe-subscriptions-createPortalLink'
  )

  const { data } = await billingPortalSession({
    returnUrl: `${window.location.origin}/account`
  })

  window.location.assign(data.url)
}

export {
  createCheckoutSession,
  createUser,
  getAllUserSubscriptions,
  goToBillingPortal
}
