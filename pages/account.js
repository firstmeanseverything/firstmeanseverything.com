import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import Alert from '@/components/alert'
import Button from '@/components/button'
import { FormInput } from '@/components/form'
import { goToBillingPortal } from '@/lib/db'
import Page from '@/components/page'
import SEO from '@/components/seo'
import SocialAuthProviders from '@/components/social-auth-providers'
import { useAuthDispatch, useAuthState } from '@/context/auth'
import { useAuthenticatedPage } from '@/hooks/auth'
import { useFormReducer } from '@/hooks/form'

function Account() {
  const { updateUser } = useAuthDispatch()
  const { isAuthenticating, user } = useAuthState()
  const { handleSubmit, setValue, ...methods } = useForm()
  const {
    formError,
    formLoading,
    formState,
    setFormError,
    setFormLoading,
    setFormSuccess
  } = useFormReducer()
  const [billingLoading, setBillingLoading] = React.useState(false)

  useAuthenticatedPage()

  React.useEffect(() => {
    if (!isAuthenticating) setValue('displayName', user.displayName)
  }, [isAuthenticating, user])

  const onSubmit = async (data) => {
    setFormLoading({ message: 'Updating your profile' })
    try {
      await updateUser(data)
      setFormSuccess()
    } catch (error) {
      setFormError({ message: error.message })
    }
  }

  return (
    <React.Fragment>
      <SEO title="Account" />
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
                            disabled={isAuthenticating || formLoading}
                          />
                        </div>
                      </div>
                      {formError && (
                        <Alert
                          title="There was a problem updating your profile"
                          message={formState.message}
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
                      isLoading={formLoading}
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
                Linked accounts
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Link your social profiles with your First Means Everything
                  account to enable sign in and other functionality.
                </p>
              </div>
              <SocialAuthProviders />
            </div>
          </div>
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
                <div className="mt-5 sm:mt-0 sm:ml-6 sm:shrink-0 sm:flex sm:items-center">
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
    </React.Fragment>
  )
}

export default Account
