import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import SignInForm from '../components/signin-form'
import { useAuthState } from '../context/auth'

function SignIn() {
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticating && user) router.push('/')
  }, [isAuthenticating, user])

  return (
    <React.Fragment>
      <div>
        <h2 className="mt-6 text-3xl leading-9 font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm leading-5 text-gray-600 max-w">
          Don't have an account?{' '}
          <Link href="/signup">
            <a className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
              Sign up for free
            </a>
          </Link>
        </p>
      </div>
      <div className="mt-8">
        <SignInForm />
      </div>
    </React.Fragment>
  )
}

export default SignIn
