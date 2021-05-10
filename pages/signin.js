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
      <div className="mt-8 space-y-6">
        <SignInForm />
      </div>
    </React.Fragment>
  )
}

SignIn.getLayout = getAuthLayout

export default SignIn
