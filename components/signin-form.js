import { FormContext, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { FormInput } from './form'
import { useAuthDispatch } from '../context/auth'

function SignInForm() {
  const { signIn } = useAuthDispatch()
  const { handleSubmit, ...methods } = useForm({
    validationSchema: yup.object().shape({
      username: yup
        .string()
        .required('Email address is required')
        .email('Email is not valid'),
      password: yup.string().required('Password is required'),
    }),
  })

  const onSubmit = async (data) => {
    try {
      await signIn(data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <FormContext {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <FormInput field="username" placeholder="Email address" />
        </div>
        <div className="mb-4">
          <FormInput field="password" type="password" placeholder="Password" />
        </div>
        <button type="submit">Go</button>
      </form>
    </FormContext>
  )
}

export default SignInForm
