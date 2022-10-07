import * as React from 'react'

import Alert from '@/components/alert'
import Button from '@/components/button'
import { createCheckoutSession } from '@/lib/stripe'
import PercentageRepWork from '@/components/mdx/percentage-rep-work'
import PercentageWeightWork from '@/components/mdx/percentage-weight-work'
import WorkoutBlock from '@/components/workout-block'

const competitionMdxComponents = {
  Alert: Alert,
  SpectatorTickets: ({ competition, price, ...props }) => {
    const [checkoutLoading, setCheckoutLoading] = React.useState(false)

    const handleClick = async () => {
      try {
        setCheckoutLoading(true)

        const checkoutSession = await createCheckoutSession({
          adjustable_quantity: { enabled: true, minimum: 1, maximum: 10 },
          allow_promotion_codes: false,
          metadata: {
            webhook_action: 'spectator'
          },
          mode: 'payment',
          price
        })

        window.location.assign(checkoutSession.url)
      } catch (error) {
        console.error(error)
      } finally {
        setCheckoutLoading(false)
      }
    }

    const pastCompetition = new Date(competition.endDate) < new Date()

    return (
      <Button
        onClick={handleClick}
        isLoading={checkoutLoading}
        isDisabled={pastCompetition}
        {...props}
      >
        Buy spectator tickets
      </Button>
    )
  }
}

const programMdxComponents = {
  Conditioning: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Conditioning" type="conditioning">
      {children}
    </WorkoutBlock>
  ),
  Gymnastics: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Gymnastics" type="gymnastics">
      {children}
    </WorkoutBlock>
  ),
  Metcon: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Metcon" type="metcon">
      {children}
    </WorkoutBlock>
  ),
  PercentageRep: PercentageRepWork,
  PercentageWeight: PercentageWeightWork,
  Strength: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Strength" type="strength">
      {children}
    </WorkoutBlock>
  )
}

export { competitionMdxComponents, programMdxComponents }
