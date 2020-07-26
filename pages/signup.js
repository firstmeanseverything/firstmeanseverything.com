import { useEffect } from 'react'
import { useRouter } from 'next/router'

import SignUpForm from '../components/signup-form'
import { useAuthState } from '../context/auth'

function SignUp() {
  const { user } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (user) router.push('/')
  }, [user])

  return <SignUpForm />
}

export default SignUp
