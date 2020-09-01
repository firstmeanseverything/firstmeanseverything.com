import { useState } from 'react'

import Button from './button'
import { createCheckoutSession } from '../lib/db'
import { useAuthState } from '../context/auth'

function SubscriptionCTA({ description, name, prices }) {
  const { isAuthenticating, user } = useAuthState()
  const [activeBillingInterval, setBillingInterval] = useState('month')
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const activePrice = prices.find(
    (price) => price.interval === activeBillingInterval
  )

  return (
    <div className="pb-16 sm:pb-20 lg:pb-28">
      <div className="max-w-lg mx-auto rounded-lg shadow overflow-hidden lg:max-w-none lg:flex">
        <div className="bg-white px-6 py-8 lg:flex-shrink-1 lg:p-12">
          <h3 className="text-2xl leading-8 font-extrabold text-gray-900 sm:text-3xl sm:leading-9">
            {name}
          </h3>
          <p className="mt-6 text-base leading-6 text-gray-500">
            {description}
          </p>
          <div className="mt-8">
            <div className="flex items-center">
              <h4 className="flex-shrink-0 pr-4 bg-white text-sm leading-5 tracking-wider font-semibold uppercase text-indigo-600">
                What's included
              </h4>
              <div className="flex-1 border-t-2 border-gray-200"></div>
            </div>
            <ul className="mt-8 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
              <li className="flex items-start lg:col-span-1">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-sm leading-5 text-gray-700">
                  Weekly program published every Monday
                </p>
              </li>
              <li className="mt-5 flex items-start lg:col-span-1 lg:mt-0">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-sm leading-5 text-gray-700">
                  RX and scaled tracks available
                </p>
              </li>
              <li className="mt-5 flex items-start lg:col-span-1 lg:mt-0">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-sm leading-5 text-gray-700">
                  8 week cycles switching focus between conditioning,
                  weightlifting and gymnastics
                </p>
              </li>
              <li className="mt-5 flex items-start lg:col-span-1 lg:mt-0">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-sm leading-5 text-gray-700">
                  Access to private Facebook community
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="py-8 px-6 text-center bg-gray-800 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
          <p className="text-lg leading-6 font-medium text-gray-300">
            Subscribe today for just
          </p>
          <div className="mt-4 flex items-center justify-center text-5xl leading-none font-extrabold text-white">
            <span>
              {new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: activePrice.currency,
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(activePrice.unit_amount / 100)}
            </span>
            <span className="ml-3 text-xl leading-7 font-medium text-gray-300">
              / {activePrice.interval}
            </span>
          </div>
          <div className="mt-6">
            <Button
              onClick={() => {
                setCheckoutLoading(true)
                createCheckoutSession(user.uid, activePrice.id)
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
    </div>
  )
}

export default SubscriptionCTA
