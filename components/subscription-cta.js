import * as React from 'react'
import { CheckCircleIcon } from '@heroicons/react/solid'

import Button from '@/components/button'
import { createCheckoutSession } from '@/lib/db'
import { useAuthState } from '@/context/auth'

function SubscriptionCTA({ description, name, prices }) {
  const { isAuthenticating, user } = useAuthState()
  const [activeBillingInterval, setBillingInterval] = React.useState('month')
  const [checkoutLoading, setCheckoutLoading] = React.useState(false)

  const activePrice = prices.find(
    (price) => price.interval === activeBillingInterval
  )

  return (
    <div className="overflow-hidden sm:rounded-b-lg lg:flex">
      <div className="lg:shrink-1 px-6 py-8 lg:p-12">
        <h3 className="text-2xl font-extrabold leading-8 text-gray-900 sm:text-3xl sm:leading-9">
          {name}
        </h3>
        <p className="mt-6 text-base leading-6 text-gray-500">{description}</p>
        <div className="mt-8">
          <div className="flex items-center">
            <h4 className="shrink-0 bg-white pr-4 text-sm font-semibold uppercase leading-5 tracking-wider text-indigo-600">
              What's included
            </h4>
            <div className="flex-1 border-t-2 border-gray-200"></div>
          </div>
          <ul className="mt-8 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
            <li className="flex items-start lg:col-span-1">
              <div className="shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              </div>
              <p className="ml-3 text-sm leading-5 text-gray-700">
                Weekly program published every Monday
              </p>
            </li>
            <li className="mt-5 flex items-start lg:col-span-1 lg:mt-0">
              <div className="shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              </div>
              <p className="ml-3 text-sm leading-5 text-gray-700">
                RX and scaled tracks available
              </p>
            </li>
            <li className="mt-5 flex items-start lg:col-span-1 lg:mt-0">
              <div className="shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              </div>
              <p className="ml-3 text-sm leading-5 text-gray-700">
                8 week cycles switching focus between conditioning,
                weightlifting and gymnastics
              </p>
            </li>
            <li className="mt-5 flex items-start lg:col-span-1 lg:mt-0">
              <div className="shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              </div>
              <p className="ml-3 text-sm leading-5 text-gray-700">
                Access to private Facebook community
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-gray-800 py-8 px-6 text-center lg:flex lg:shrink-0 lg:flex-col lg:justify-center lg:p-12">
        <p className="text-lg font-medium leading-6 text-gray-300">
          Subscribe today for just
        </p>
        <div className="mt-4 flex items-center justify-center text-5xl font-extrabold leading-none text-white">
          <span>
            {new Intl.NumberFormat('en-GB', {
              style: 'currency',
              currency: activePrice.currency,
              maximumFractionDigits: 0,
              minimumFractionDigits: 0
            }).format(activePrice.unit_amount / 100)}
          </span>
          <span className="ml-3 text-xl font-medium leading-7 text-gray-300">
            / {activePrice.interval}
          </span>
        </div>
        <div className="mt-6">
          <Button
            onClick={() => {
              setCheckoutLoading(true)
              createCheckoutSession(user, activePrice.id)
            }}
            size="xlarge"
            theme="yellow"
            isDisabled={isAuthenticating}
            isLoading={checkoutLoading}
          >
            Unlock
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionCTA
