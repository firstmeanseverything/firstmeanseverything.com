import * as React from 'react'
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
    case 'SUCCESS':
      return { ...state, formState: 'success', ...payload }
    default:
      throw new Error(`Unhandled action type: ${type}`)
  }
}

function ForgotForm() {
  const { sendPasswordReset } = useAuthDispatch()
  const { handleSubmit, ...methods } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .required('Email address is required')
          .email('Email is not valid'),
      })
    ),
  })
  const [state, dispatch] = React.useReducer(reducer, {
    formState: null,
    message: null,
  })

  const isError = state.formState === 'error'
  const isLoading = state.formState === 'loading'
  const isSuccess = state.formState === 'success'

  const onSubmit = async ({ email }) => {
    dispatch({
      type: 'LOADING',
      payload: { message: 'Sending a password reset' },
    })
    try {
      await sendPasswordReset(email)
      dispatch({
        type: 'SUCCESS',
        payload: { message: 'Check your email for further instructions' },
      })
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: { message: error.message },
      })
    }
  }

  return (
    <FormProvider {...methods}>
      {isError && (
        <Alert
          title="There was a problem sending a password reset"
          message={state.message}
        />
      )}
      {isSuccess ? (
        <Alert
          type="success"
          title="Password reset sent"
          message={state.message}
        />
      ) : (
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
              <Button type="submit" size="large" isLoading={isLoading}>
                Send password reset
              </Button>
            </div>
          </form>
        </div>
      )}
    </FormProvider>
  )
}

export default ForgotForm
