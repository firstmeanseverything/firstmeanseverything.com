import * as React from 'react'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import cx from 'classnames'

import Alert from '@/components/alert'
import Button from '@/components/button'
import { FormInput } from '@/components/form'
import { useAuthDispatch, useAuthState } from '@/context/auth'
import { useFormReducer } from '@/hooks/form'

function SignInForm() {
  const { signInWithEmail, signInWithProvider } = useAuthDispatch()
  const { availableAuthProviders } = useAuthState()
  const { handleSubmit, ...methods } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .required('Email address is required')
          .email('Email is not valid'),
        password: yup.string().required('Password is required')
      })
    )
  })
  const { formError, formLoading, formState, setFormError, setFormLoading } =
    useFormReducer()

  const providerSignIn = async (provider) => {
    setFormLoading({ message: 'Signing you in' })
    try {
      await signInWithProvider(provider)
    } catch (error) {
      setFormError({ message: error.message })
    }
  }

  const emailSignIn = async ({ email, password }) => {
    setFormLoading({ message: 'Signing you in' })
    try {
      await signInWithEmail(email, password)
    } catch (error) {
      setFormError({ message: error.message })
    }
  }

  return (
    <React.Fragment>
      {formError && (
        <Alert
          title="There was a problem signing you in"
          message={formState.message}
        />
      )}
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-700">Sign in with</p>
          <div className="mt-1 grid grid-cols-1 gap-3">
            {availableAuthProviders.map((provider, index) => {
              const IconSVG = provider.icon

              return (
                <div key={index}>
                  <button
                    className={cx(
                      'inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50',
                      {
                        'cursor-not-allowed opacity-50': formLoading
                      }
                    )}
                    onClick={() => providerSignIn(provider.instance)}
                    disabled={formLoading}
                  >
                    <span className="sr-only">
                      Sign in with {provider.name}
                    </span>
                    <IconSVG className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
      </div>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(emailSignIn)}>
            <div>
              <FormInput
                field="email"
                type="email"
                label="Email address"
                placeholder="team@firstmeanseverything.com"
                disabled={formLoading}
              />
            </div>
            <div className="mt-6">
              <FormInput
                field="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                disabled={formLoading}
              />
            </div>
            <div className="mt-6 flex items-center justify-end">
              <div className="text-sm leading-5">
                <Link
                  href="/forgot"
                  className="font-medium text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500 focus:underline focus:outline-none"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div className="mt-6">
              <Button type="submit" size="large" isLoading={formLoading}>
                Sign in
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </React.Fragment>
  )
}

export default SignInForm
