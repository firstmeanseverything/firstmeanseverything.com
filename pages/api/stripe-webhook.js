import { buffer } from 'micro'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req, res) => {
  const buf = await buffer(req)

  let event

  try {
    event = stripe.webhooks.constructEvent(
      buf.toString(),
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.log(`❌ Error message: ${err.message}`)

    return res.status(400).json({ status: 400, message: error.message })
  }

  res.status(201).json({ status: 201, message: 'Webhook actioned' })
}
