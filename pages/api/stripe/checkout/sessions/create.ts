import { getFirestore } from 'firebase-admin/firestore'

import admin from '@/lib/firebase-admin'
import { stripe } from '@/lib/stripe'
import { validateToken } from '@/lib/db-admin'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Stripe } from 'stripe'

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Stripe.Checkout.Session | { message: any }>,
  user: any
) {
  try {
    const { stripeId: customer }: FirebaseFirestore.DocumentData = (
      await getFirestore(admin).collection('users').doc(user.uid).get()
    ).data()

    const {
      allow_promotion_codes = true,
      cancel_url,
      price,
      success_url,
      trial_from_plan = false
    } = req.body

    const params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes,
      cancel_url,
      customer,
      line_items: [
        {
          price,
          quantity: 1
        }
      ],
      mode: 'subscription',
      subscription_data: { trial_from_plan },
      success_url
    }

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params)

    res.status(201).json(checkoutSession)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export default validateToken(handler)