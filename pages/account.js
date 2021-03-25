import * as React from 'react'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'

import Alert from '@/components/alert'
import Button from '@/components/button'
import { FormInput } from '@/components/form'
import { goToBillingPortal } from '@/lib/db'
import Page from '@/components/page'
import { useAuthDispatch, useAuthState } from '@/context/auth'

function reducer(state, { payload, type }) {
  switch (type) {
    case 'ERROR':
      return { ...state, formState: 'error', ...payload }
    case 'LOADING':
      return { ...state, formState: 'loading', ...payload }
    case 'SUCCESS':
      return { ...state, formState: null }
    default:
      throw new Error(`Unhandled action type: ${type}`)
  }
}

function Account() {
  const { updateUser } = useAuthDispatch()
  const { isAuthenticating, user } = useAuthState()
  const { handleSubmit, setValue, ...methods } = useForm()
  const [state, dispatch] = React.useReducer(reducer, {
    formState: null,
    message: null
  })
  const router = useRouter()
  const [billingLoading, setBillingLoading] = React.useState(false)

  const isError = state.formState === 'error'
  const isLoading = state.formState === 'loading'

  React.useEffect(() => {
    if (!isAuthenticating && !user) router.push('/signin')
  }, [isAuthenticating, user])

  React.useEffect(() => {
    if (!isAuthenticating) setValue('displayName', user.displayName)
  }, [isAuthenticating, user])

  const onSubmit = async (data) => {
    dispatch({
      type: 'LOADING',
      payload: { message: 'Updating your profile' }
    })
    try {
      await updateUser(data)
      dispatch({
        type: 'SUCCESS'
      })
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: { message: error.message }
      })
    }
  }

  return (
    <Page title="Account">
      <div className="space-y-6">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white shadow rounded overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Profile
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      Your public profile.
                    </p>
                  </div>
                  <div className="mt-5 space-y-6 md:mt-0 md:col-span-2">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <FormInput
                          field="displayName"
                          label="Name"
                          placeholder="Your name"
                          disabled={isAuthenticating || isLoading}
                        />
                      </div>
                    </div>
                    {isError && (
                      <Alert
                        title="There was a problem updating your profile"
                        message={state.message}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <div className="sm:inline-flex sm:justify-end">
                  <Button
                    type="submit"
                    isDisabled={isAuthenticating}
                    isLoading={isLoading}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
        <div className="bg-white shadow rounded sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Manage billing
            </h3>
            <div className="mt-2 sm:flex sm:items-start sm:justify-between">
              <div className="max-w-xl text-sm leading-5 text-gray-500">
                <p>
                  First Means Everything uses Stripe to manage your
                  subscription. You can cancel or update your subscription and
                  manage your payment methods through the secure portal.
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
      </div>
    </Page>
  )
}

export default Account
