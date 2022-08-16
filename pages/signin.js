import * as React from 'react'
import Link from 'next/link'

import { getLayout as getAuthLayout } from '@/components/layout/auth'
import SEO from '@/components/seo'
import SignInForm from '@/components/signin-form'
import { useUnauthenticatedPage } from '@/hooks/auth'

function SignIn() {
  useUnauthenticatedPage()

  return (
    <React.Fragment>
      <SEO title="Sign In" />
      <div>
        <h2 className="mt-6 text-3xl font-extrabold leading-9 text-gray-900">
          Sign in to your account
        </h2>
        <p className="max-w mt-2 text-sm leading-5 text-gray-600">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500 focus:underline focus:outline-none"
          >
            Sign up for free
          </Link>
        </p>
      </div>
      <div className="mt-8 space-y-6">
        <SignInForm />
      </div>
    </React.Fragment>
  )
}

SignIn.getLayout = getAuthLayout

export default SignIn
