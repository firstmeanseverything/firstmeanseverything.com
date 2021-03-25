import * as React from 'react'
import Link from 'next/link'

import { getLayout as getAuthLayout } from '@/components/layout/auth'
import SignUpForm from '@/components/signup-form'
import { useUnauthenticatedPage } from '@/hooks/auth'

function SignUp() {
  useUnauthenticatedPage()

  return (
    <React.Fragment>
      <div>
        <h2 className="mt-6 text-3xl leading-9 font-extrabold text-gray-900">
          Sign up for an account
        </h2>
        <p className="mt-2 text-sm leading-5 text-gray-600 max-w">
          Already have an account?{' '}
          <Link href="/signin">
            <a className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
              Sign in
            </a>
          </Link>
        </p>
      </div>
      <div className="mt-8">
        <SignUpForm />
      </div>
    </React.Fragment>
  )
}

SignUp.getLayout = getAuthLayout

export default SignUp
