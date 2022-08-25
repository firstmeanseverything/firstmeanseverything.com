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
  cancel_path,
  price = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
  success_path,
  ...rest
} = {}) =>
  await fetcher({
    body: {
      allow_promotion_codes: true,
      cancel_url: cancel_path
        ? `${window.location.origin}/${cancel_path}`
        : window.location.href,
      price,
      success_url: success_path
        ? `${window.location.origin}/${success_path}`
        : window.location.href,
      ...rest
    },
    headers: { Authorization: cookie.get('first-means-everything') },
    method: 'POST',
    url: '/api/stripe/checkout/sessions/create'
  })

export { createCheckoutSession, getStripe }
