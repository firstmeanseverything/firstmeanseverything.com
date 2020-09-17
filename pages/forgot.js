import { useEffect } from 'react'
import { useRouter } from 'next/router'

import ForgotForm from '../components/forgot-form'
import { useAuthState } from '../context/auth'

function ForgotPassword() {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticating && user) router.push('/')
  }, [isAuthenticating, user])

  return (
    <React.Fragment>
      <div>
        <h2 className="mt-6 text-3xl leading-9 font-extrabold text-gray-900">
          Reset your password
        </h2>
      </div>
      <div className="mt-8">
        <ForgotForm />
      </div>
    </React.Fragment>
  )
}

export default ForgotPassword
