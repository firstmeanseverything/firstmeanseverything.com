import { getFirestore } from 'firebase-admin/firestore'

import admin from '@/lib/firebase-admin'
import { stripe } from '@/lib/stripe'
import { validateToken } from '@/lib/db-admin'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Stripe } from 'stripe'

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Stripe.BillingPortal.Session | { message: any }>,
  user: any
) {
  try {
    const { stripeId: customer }: FirebaseFirestore.DocumentData = (
      await getFirestore(admin).collection('users').doc(user.uid).get()
    ).data()

    const { return_url } = req.body

    const params: Stripe.BillingPortal.SessionCreateParams = {
      customer,
      return_url
    }

    const customerPortalSession: Stripe.BillingPortal.Session =
      await stripe.billingPortal.sessions.create(params)

    res.status(201).json(customerPortalSession)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export default validateToken(handler)
