import Stripe from 'stripe'

import { createCheckoutSession, goToBillingPortal } from '../lib/db'
import { useAuthState } from '../context/auth'

function Index({ prices }) {
  const { user } = useAuthState()

  return (
    <React.Fragment>
      <div>
        {prices.map((price) =>
          new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: price.currency,
            minimumFractionDigits: 0,
          }).format(price.unit_amount / 100)
        )}
      </div>
      <button onClick={() => createCheckoutSession(user.uid, prices[0].id)}>
        Subscribe
      </button>
      <button onClick={() => goToBillingPortal()}>Manage</button>
    </React.Fragment>
  )
}

export async function getStaticProps() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const { data: prices } = await stripe.prices.list({
    active: true,
    expand: ['data.product'],
    product: 'prod_HhE1ef4MH5DDwC',
  })

  return {
    props: { prices },
  }
}

export default Index
