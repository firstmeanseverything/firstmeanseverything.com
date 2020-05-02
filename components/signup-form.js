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
        <div className="mb-4">
          <FormInput field="username" placeholder="Username" />
        </div>
        <div className="mb-4">
          <FormInput field="email" type="email" placeholder="Email address" />
        </div>
        <div className="grid grid-cols-1 gap-2 mb-4 sm:grid-cols-2 ">
          <FormInput field="password" type="password" placeholder="Password" />
          <FormInput field="confirm" type="password" placeholder="Confirm" />
        </div>
        <button type="submit">Go</button>
      </form>
    </FormContext>
  )
}

export default SignUpForm
