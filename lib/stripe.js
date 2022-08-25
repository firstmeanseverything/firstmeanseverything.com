import { loadStripe } from '@stripe/stripe-js'
import cookie from 'js-cookie'

import fetcher from '@/lib/fetcher'

let stripePromise

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  }

  return stripePromise
}

const createCheckoutSession = async ({
  cancel_url = window.location.href,
  price,
  success_url = window.location.href,
  ...rest
}) =>
  await fetcher({
    body: {
      allow_promotion_codes: true,
      cancel_url,
      price,
      success_url,
      ...rest
    },
    headers: { Authorization: cookie.get('first-means-everything') },
    method: 'POST',
    url: '/api/stripe/checkout/sessions/create'
  })

export { createCheckoutSession, getStripe }
