import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
  try {
    const { email, name } = req.body

    const customer = await stripe.customers.create({
      email,
      name,
    })

    res.status(201).json(customer)
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message })
  }
}
