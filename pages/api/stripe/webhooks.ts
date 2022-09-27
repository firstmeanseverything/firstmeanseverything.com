import type { NextApiRequest, NextApiResponse } from 'next'

import { Stripe } from 'stripe'

import { addSpectatorSheetRow } from '@/lib/google-spreadsheet'

export const config = {
  api: {
    bodyParser: false
  }
}

const verifyStripeSignature =
  (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
      event: Stripe.Event
    ) => void
  ) =>
  async (req: NextApiRequest, res: NextApiResponse<{ message: any }>) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27'
    })

    const chunks = []

    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        Buffer.concat(chunks),
        req.headers['stripe-signature'],
        process.env.STRIPE_WEBHOOK_SECRET
      )

      return handler(req, res, event)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

const handleCheckoutSession = async (
  checkoutSession: Stripe.Checkout.Session
) => {
  switch (checkoutSession.metadata.webhook_action) {
    case 'spectator':
      await addSpectatorSheetRow({
        sheetId: process.env.GOOGLE_SHEET_SPECTATOR_ID,
        checkoutSession
      })
      break
    default:
      console.log('no action')
      break
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>,
  event: Stripe.Event
) {
  const permittedEvents: string[] = ['checkout.session.completed']

  if (req.method === 'POST') {
    if (permittedEvents.includes(event.type)) {
      try {
        switch (event.type) {
          case 'checkout.session.completed':
            await handleCheckoutSession(
              event.data.object as Stripe.Checkout.Session
            )
            break
          default:
            throw new Error(`Unhhandled event: ${event.type}`)
        }
      } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Webhook handler failed' })
      }
    }

    res.status(200).json({ message: 'Received' })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default verifyStripeSignature(handler)
