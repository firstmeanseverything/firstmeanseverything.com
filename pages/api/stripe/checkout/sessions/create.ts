import { getFirestore } from 'firebase-admin/firestore'
import { Stripe } from 'stripe'

import admin from '@/lib/firebase-admin'
import { validateToken } from '@/lib/db-admin'

import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Stripe.Checkout.Session | { message: any }>,
  user: any
) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-08-01'
    })

    const findUserCustomerId = async (user) => {
      const userDoc: FirebaseFirestore.DocumentData = (
        await getFirestore(admin).collection('users').doc(user?.uid).get()
      ).data()

      if (!userDoc?.stripeId)
        throw new Error(`No Stripe ID found for this user`)

      return userDoc?.stripeId
    }

    const {
      adjustable_quantity = { enabled: false },
      allow_promotion_codes = true,
      customer_creation = 'if_required',
      mode = 'subscription',
      price,
      trial_from_plan = false,
      ...rest
    } = req.body

    const params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes,
      ...(user
        ? { customer: await findUserCustomerId(user) }
        : { customer_creation }),
      line_items: [
        {
          adjustable_quantity,
          price,
          quantity: 1
        }
      ],
      mode,
      ...(mode === 'subscription' && {
        subscription_data: { trial_from_plan }
      }),
      ...rest
    }

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params)

    res.status(201).json(checkoutSession)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export default validateToken(handler)
