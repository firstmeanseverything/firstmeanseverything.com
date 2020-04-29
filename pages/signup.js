import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { useAuthState, useAuthDispatch } from '../context/auth'
import { useForm } from 'react-hook-form'

function SignUp() {
  const { signUp } = useAuthDispatch()
  const { isAuthenticated } = useAuthState()
  const methods = useForm()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.push('/')
  }, [isAuthenticated])

  const onSubmit = async (data) => {
    try {
      await signUp(data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <input
        type="text"
        name="username"
        ref={methods.register({ required: true })}
      ></input>
      <input
        type="email"
        name="email"
        ref={methods.register({ required: true })}
      ></input>
      <input
        type="password"
        name="password"
        ref={methods.register({ required: true })}
      ></input>
      <button type="submit">Go</button>
    </form>
  )
}

export default SignUp
