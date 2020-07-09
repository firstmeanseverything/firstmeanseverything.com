import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
  try {
    const { email, name } = req.body

    const { id: stripe_customer_id } = await stripe.customers.create({
      email,
      name,
    })

    res.status(201).json({ stripe_customer_id })
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, mesage: 'There was an issue creating the customer' })
  }
}
