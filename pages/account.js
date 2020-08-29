import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Button from '../components/button'
import { goToBillingPortal } from '../lib/db'
import Page from '../components/page'
import { useAuthState } from '../context/auth'

function Account() {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()
  const [billingLoading, setBillingLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticating && !user) router.push('/signin')
  }, [isAuthenticating, user])

  return (
    <Page title="Account">
      <div className="bg-white shadow rounded sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Manage billing
          </h3>
          <div className="mt-2 sm:flex sm:items-start sm:justify-between">
            <div className="max-w-xl text-sm leading-5 text-gray-500">
              <p>
                First Means Everything uses Stripe to manage your subscription.
                You can cancel or update your subscription and manage your
                payment methods through the secure portal.
              </p>
            </div>
            <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
              <Button
                onClick={() => {
                  setBillingLoading(true)
                  goToBillingPortal()
                }}
                isDisabled={isAuthenticating}
                isLoading={billingLoading}
              >
                Manage billing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default Account
