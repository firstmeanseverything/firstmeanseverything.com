import type { NextPage } from 'next'

import * as React from 'react'

import { createCheckoutSession } from '@/lib/stripe'
import { SpinnerSVG } from '@/components/icons'
import { useAuthenticatedPage } from '@/hooks/auth'
import { useAuthState } from '@/context/auth'

function SubscribePage({}: NextPage) {
  const { isAuthenticating, user, userHasSubscription } = useAuthState()

  useAuthenticatedPage()

  React.useEffect(() => {
    async function subscribeUser(): Promise<void> {
      const checkoutSession = await createCheckoutSession({
        cancel_path: '/program',
        success_path: '/program'
      })

      window.location.assign(checkoutSession.url)
    }

    if (!(isAuthenticating || userHasSubscription) && user) subscribeUser()
  }, [isAuthenticating, user, userHasSubscription])

  return (
    <div className="mt-8 flex justify-center">
      <SpinnerSVG className="h-6 w-6 animate-spin" />
    </div>
  )
}

export default SubscribePage
