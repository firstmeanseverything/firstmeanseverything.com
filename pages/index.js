import Stripe from 'stripe'

function Index({ prices }) {
  return 'hi'
}

export async function getStaticProps() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  const { data: prices } = await stripe.prices.list({
    active: true,
    expand: ['data.product'],
    product: 'prod_GluoMMJud0rQns',
  })

  return {
    props: { prices },
  }
}

export default Index
