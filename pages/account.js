import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import cx from 'classnames'

import { goToBillingPortal } from '../lib/db'
import { useAuthState } from '../context/auth'

function Account() {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()
  const [billingLoading, setBillingLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticating && !user) router.push('/signin')
  }, [isAuthenticating, user])

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Manage billing
        </h3>
        <div className="mt-2 sm:flex sm:items-start sm:justify-between">
          <div className="max-w-xl text-sm leading-5 text-gray-500">
            <p>
              First Means Everything uses Stripe to manage your subscription.
              You can cancel or update your subscription and manage your payment
              methods through the secure portal.
            </p>
          </div>
          <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
            <span className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => {
                  setBillingLoading(true)
                  goToBillingPortal()
                }}
                className={cx(
                  'inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150',
                  {
                    'cursor-not-allowed opacity-50':
                      isAuthenticating || billingLoading,
                    'hover:bg-indigo-500': !isAuthenticating || !billingLoading,
                  }
                )}
                disabled={isAuthenticating || billingLoading}
              >
                Manage billing
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
