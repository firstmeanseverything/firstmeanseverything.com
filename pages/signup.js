import { useEffect } from 'react'
import { useRouter } from 'next/router'

import SignUpForm from '../components/signup-form'
import { useAuthState } from '../context/auth'

function SignUp() {
  const { isAuthenticated } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) router.push('/')
  }, [isAuthenticated])

  return <SignUpForm />
}

export default SignUp
