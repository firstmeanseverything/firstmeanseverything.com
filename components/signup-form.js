import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Alert from '@/components/alert'
import Button from '@/components/button'
import { FormInput } from '@/components/form'
import { useAuthDispatch } from '@/context/auth'
import { useFormReducer } from '@/hooks/form'

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
          .oneOf([yup.ref('password'), null], 'Passwords do not match')
      })
    )
  })
  const { formError, formLoading, formState, setFormLoading, setFormError } =
    useFormReducer()

  const onSubmit = async ({ email, password }) => {
    setFormLoading({ message: 'Creating your account' })
    try {
      await signUp(email, password)
    } catch (error) {
      setFormError({ message: error.message })
    }
  }

  return (
    <FormProvider {...methods}>
      {formError && (
        <Alert
          title="There was a problem creating your account"
          message={formState.message}
        />
      )}
      <div className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <div className="mb-4 grid grid-cols-1 gap-2 gap-y-6 sm:grid-cols-2">
              <FormInput
                field="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                disabled={formLoading}
              />
              <FormInput
                field="confirm"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                disabled={formLoading}
              />
            </div>
          </div>
          <div className="mt-6">
            <Button type="submit" size="large" isLoading={formLoading}>
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

export default SignUpForm
