import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
  try {
    const { customerId, invoiceId, paymentMethodId } = req.body

    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    })

    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    const invoice = await stripe.invoices.retrieve(invoiceId, {
      expand: ['payment_intent'],
    })

    res.status(201).json(invoice)
  } catch (error) {
    res.status('500').json({ status: 500, message: error.message })
  }
}
