import { useReducer } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
import * as yup from 'yup'

import Alert from './alert'
import Button from './button'
import { FormInput } from './form'
import { useAuthDispatch } from '../context/auth'
import { useRouter } from 'next/router'

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

function ResetForm() {
  const { confirmPasswordReset } = useAuthDispatch()
  const { handleSubmit, ...methods } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        password: yup
          .string()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters'),
        confirm: yup
          .string()
          .required('Password confirmation is required')
          .oneOf([yup.ref('password'), null], 'Passwords do not match'),
      })
    ),
  })
  const [state, dispatch] = useReducer(reducer, {
    formState: null,
    message: null,
  })
  const router = useRouter()

  const isError = state.formState === 'error'
  const isLoading = state.formState === 'loading'
  const isSuccess = state.formState === 'success'

  const onSubmit = async ({ password }) => {
    dispatch({
      type: 'LOADING',
      payload: { message: 'Saving your new password' },
    })
    try {
      await confirmPasswordReset(router.query.oobCode, password)
      dispatch({
        type: 'SUCCESS',
        payload: {
          message:
            'You will now be redirected to sign in using your new password',
        },
      })

      setTimeout(() => {
        router.push('/signin')
      }, 3000)
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
          title="There was a problem saving your new password"
          message={state.message}
        />
      )}
      {isSuccess ? (
        <Alert
          type="success"
          title="Password updated successfully"
          message={state.message}
        />
      ) : (
        <div className="mt-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="grid grid-cols-1 gap-2 mb-4 gap-y-6 sm:grid-cols-2">
                <FormInput
                  field="password"
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <FormInput
                  field="confirm"
                  type="password"
                  label="Confirm Password"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="mt-6">
              <Button type="submit" size="large" isLoading={isLoading}>
                Update your password
              </Button>
            </div>
          </form>
        </div>
      )}
    </FormProvider>
  )
}

export default ResetForm
