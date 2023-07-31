import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-08-01'
})

export async function POST(req: Request, res: Response) {
  try {
    const body = (await req.json()) as Stripe.Checkout.SessionCreateParams

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(body)

    return NextResponse.json(checkoutSession, { status: 201 })
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'There was a problem with your request'

    return NextResponse.json({ message }, { status: 400 })
  }
}
