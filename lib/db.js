import firebase from './firebase'
import getStripe from './stripe'

const createCheckoutSession = async (uid, price) => {
  const checkoutSessionRef = await firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .collection('checkout_sessions')
    .add({
      price,
      allow_promotion_codes: true,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    })

  checkoutSessionRef.onSnapshot(async (snap) => {
    const { sessionId } = snap.data()

    if (sessionId) {
      const stripe = await getStripe()

      stripe.redirectToCheckout({ sessionId })
    }
  })
}

const createUser = (uid, data) => {
  return firebase
    .firestore()
    .collection('users')
    .doc(uid)
    .set({ uid, ...data }, { merge: true })
}

const goToBillingPortal = async () => {
  const functionRef = firebase
    .app()
    .functions('europe-west2')
    .httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink')

  const { data } = await functionRef({
    returnUrl: `${window.location.origin}/account`,
  })

  window.location.assign(data.url)
}

export { createCheckoutSession, createUser, goToBillingPortal }
