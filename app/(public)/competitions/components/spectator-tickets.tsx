'use client'

import type { Stripe } from 'stripe'
import type { Competition } from '@/graphql/sdk'

import * as React from 'react'
import subDays from 'date-fns/subDays'

import Button from '@/components/button'
import fetcher from '@/lib/fetcher'

interface SpectatorTicketsProps {
  competition: Competition
  price: string
}

export default function SpectatorTickets({
  competition,
  price,
  ...props
}: SpectatorTicketsProps): JSX.Element {
  const [checkoutLoading, setCheckoutLoading] = React.useState<boolean>(false)

  const handleSubmit = async (): Promise<void> => {
    try {
      setCheckoutLoading(true)

      const checkoutSession = await fetcher<Promise<Stripe.Checkout.Session>>(
        '/api/stripe/checkout/sessions/create',
        {
          method: 'POST',
          body: JSON.stringify({
            cancel_url: window.location.href,
            line_items: [
              {
                adjustable_quantity: {
                  enabled: true,
                  maximum: 10,
                  minimum: 1
                },
                price,
                quantity: 1
              }
            ],
            mode: 'payment',
            success_url: window.location.href
          } as Stripe.Checkout.SessionCreateParams)
        }
      )

      window.location.assign(checkoutSession.url as string)
    } catch (error) {
      console.error(error)
    } finally {
      setCheckoutLoading(false)
    }
  }

  const pastCompetition =
    subDays(new Date(competition.startDate), 1) < new Date()

  return (
    <Button
      type="submit"
      onClick={handleSubmit}
      isDisabled={pastCompetition}
      isLoading={checkoutLoading}
      {...props}
    >
      Buy spectator tickets
    </Button>
  )
}
