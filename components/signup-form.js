import { FormContext, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { FormInput } from './form'
import { useAuthDispatch } from '../context/auth'

function SignUpForm() {
  const { signUp } = useAuthDispatch()
  const { handleSubmit, unregister, ...methods } = useForm({
    validationSchema: yup.object().shape({
      username: yup.string().required('Username is required'),
      email: yup
        .string()
        .required('Email is required')
        .email('Email is not valid'),
      password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
      confirm: yup
        .string()
        .required('Password confirmation is required')
        .oneOf([yup.ref('password'), null], 'Passwords do not match'),
    }),
  })

  const onSubmit = async ({ confirm, ...rest }) => {
    try {
      await signUp({ ...rest })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <FormContext {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput field="username" />
        <FormInput field="email" type="email" />
        <FormInput field="password" type="password" />
        <FormInput field="confirm" type="password" />
        <button type="submit">Go</button>
      </form>
    </FormContext>
  )
}

export default SignUpForm
