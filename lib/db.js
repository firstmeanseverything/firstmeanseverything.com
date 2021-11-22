import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  setDoc,
  query,
  where
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

const getLatestActiveSubscription = async (uid) => {
  const latestSubscriptionQuery = query(
    collection(doc(db, 'users', uid), 'subscriptions'),
    where('status', 'in', ['active', 'trialing']),
    limit(1),
    orderBy('created', 'desc')
  )

  const querySnapshot = await getDocs(latestSubscriptionQuery)

  if (querySnapshot.empty) return { subscription: null }

  const [subscription] = querySnapshot.docs

  return { subscription: subscription.data() }
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
  getLatestActiveSubscription,
  goToBillingPortal
}
