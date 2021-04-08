import * as React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Alert from '@/components/alert'
import Button from '@/components/button'
import { FormInput } from '@/components/form'
import { useAuthDispatch } from '@/context/auth'
import { useFormReducer } from '@/hooks/form'

function ForgotForm() {
  const { sendPasswordReset } = useAuthDispatch()
  const { handleSubmit, ...methods } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .required('Email address is required')
          .email('Email is not valid')
      })
    )
  })
  const {
    formError,
    formLoading,
    formState,
    formSuccess,
    setFormError,
    setFormLoading,
    setFormSuccess
  } = useFormReducer()

  const onSubmit = async ({ email }) => {
    setFormLoading({ message: 'Sending a password reset' })
    try {
      await sendPasswordReset(email)
      setFormSuccess({ message: 'Check your email for further instructions' })
    } catch (error) {
      setFormError({ message: error.message })
    }
  }

  return (
    <FormProvider {...methods}>
      {formError && (
        <Alert
          title="There was a problem sending a password reset"
          message={formState.message}
        />
      )}
      {formSuccess ? (
        <Alert
          type="success"
          title="Password reset sent"
          message={formState.message}
        />
      ) : (
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
              <Button type="submit" size="large" isLoading={formLoading}>
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
