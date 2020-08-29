import { useReducer } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers'
import * as yup from 'yup'

import Button from './button'
import { FormInput } from './form'
import { useAuthDispatch } from '../context/auth'

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

function SignUpForm() {
  const { signUp } = useAuthDispatch()
  const { handleSubmit, ...methods } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .required('Email address is required')
          .email('Email is not valid'),
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

  const onSubmit = async ({ email, password }) => {
    dispatch({
      type: 'LOADING',
      payload: { message: 'Creating your account' },
    })
    try {
      await signUp(email, password)
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: { message: error.message },
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FormInput
              field="email"
              label="Email address"
              placeholder="team@firstmeanseverything.com"
            />
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-1 gap-2 mb-4 row-gap-6 sm:grid-cols-2">
              <FormInput
                field="password"
                type="password"
                label="Password"
                placeholder="••••••••"
              />
              <FormInput
                field="confirm"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="mt-6">
            <Button type="submit" size="large">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

export default SignUpForm
