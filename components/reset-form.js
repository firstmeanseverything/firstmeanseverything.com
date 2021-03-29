import * as React from 'react'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Alert from '@/components/alert'
import Button from '@/components/button'
import { FormInput } from '@/components/form'
import { useAuthDispatch } from '@/context/auth'
import { useFormReducer } from '@/hooks/form'

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
          .oneOf([yup.ref('password'), null], 'Passwords do not match')
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
  const router = useRouter()

  const onSubmit = async ({ password }) => {
    setFormLoading({ message: 'Saving your new password' })
    try {
      await confirmPasswordReset(router.query.oobCode, password)
      setFormSuccess({
        message: 'You will now be redirected to sign in using your new password'
      })

      setTimeout(() => {
        router.push('/signin')
      }, 3000)
    } catch (error) {
      setFormError({ message: error.message })
    }
  }

  return (
    <FormProvider {...methods}>
      {formError && (
        <Alert
          title="There was a problem saving your new password"
          message={formState.message}
        />
      )}
      {formSuccess ? (
        <Alert
          type="success"
          title="Password updated successfully"
          message={formState.message}
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
