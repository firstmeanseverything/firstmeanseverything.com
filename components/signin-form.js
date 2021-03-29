import * as React from 'react'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import cx from 'classnames'

import Alert from '@/components/alert'
import Button from '@/components/button'
import { FacebookSVG } from '@/components/icons'
import { FormInput } from '@/components/form'
import { useAuthDispatch } from '@/context/auth'

function reducer(state, { payload, type }) {
  switch (type) {
    case 'ERROR':
      return { ...state, formState: 'error', ...payload }
    case 'LOADING':
      return { ...state, formState: 'loading', ...payload }
    default:
      throw new Error(`Unhandled action type: ${type}`)
  }
}

function SignInForm() {
  const { signInWithEmail, signInWithFacebook } = useAuthDispatch()
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
  const [state, dispatch] = React.useReducer(reducer, {
    formState: null,
    message: null
  })

  const isError = state.formState === 'error'
  const isLoading = state.formState === 'loading'

  const facebookSignIn = async () => {
    dispatch({
      type: 'LOADING',
      payload: { message: 'Signing you in' }
    })
    try {
      await signInWithFacebook()
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: { message: error.message }
      })
    }
  }

  const emailSignIn = async ({ email, password }) => {
    dispatch({
      type: 'LOADING',
      payload: { message: 'Signing you in' }
    })
    try {
      await signInWithEmail(email, password)
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: { message: error.message }
      })
    }
  }

  return (
    <React.Fragment>
      {isError && (
        <Alert
          title="There was a problem signing you in"
          message={state.message}
        />
      )}
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-700">Sign in with</p>
          <div className="mt-1 grid grid-cols-1 gap-3">
            <div>
              <button
                className={cx(
                  'w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50',
                  {
                    'cursor-not-allowed opacity-50': isLoading
                  }
                )}
                onClick={facebookSignIn}
                disabled={isLoading}
              >
                <span className="sr-only">Sign in with Facebook</span>
                <FacebookSVG className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
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
            <span className="px-2 bg-white text-gray-500">
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
                label="Email address"
                placeholder="team@firstmeanseverything.com"
                disabled={isLoading}
              />
            </div>
            <div className="mt-6">
              <FormInput
                field="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            <div className="mt-6 flex items-center justify-end">
              <div className="text-sm leading-5">
                <Link href="/forgot">
                  <a className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                    Forgot your password?
                  </a>
                </Link>
              </div>
            </div>
            <div className="mt-6">
              <Button type="submit" size="large" isLoading={isLoading}>
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
