import * as React from 'react'
import Link from 'next/link'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Alert from 'components/alert'
import Button from 'components/button'
import { FormInput } from 'components/form'
import { useAuthDispatch } from 'context/auth'

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
  const { signIn } = useAuthDispatch()
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

  const onSubmit = async ({ email, password }) => {
    dispatch({
      type: 'LOADING',
      payload: { message: 'Signing you in' }
    })
    try {
      await signIn(email, password)
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: { message: error.message }
      })
    }
  }

  return (
    <FormProvider {...methods}>
      {isError && (
        <Alert
          title="There was a problem signing you in"
          message={state.message}
        />
      )}
      <div className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
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
      </div>
    </FormProvider>
  )
}

export default SignInForm
