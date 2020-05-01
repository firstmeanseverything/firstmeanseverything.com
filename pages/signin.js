import { useEffect } from 'react'
import { useRouter } from 'next/router'

import SignInForm from '../components/signin-form'
import { useAuthState } from '../context/auth'

function SignIn() {
  const { isAuthenticated } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.push('/')
  }, [isAuthenticated])

  return <SignInForm />
}

export default SignIn
