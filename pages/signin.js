import { useEffect } from 'react'
import { useRouter } from 'next/router'

import SignInForm from '../components/signin-form'
import { useAuthState } from '../context/auth'

function SignIn() {
  const { user } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (user) router.push('/')
  }, [user])

  return <SignInForm />
}

export default SignIn
