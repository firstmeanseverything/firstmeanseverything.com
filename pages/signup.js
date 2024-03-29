import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { getLayout as getAuthLayout } from '@/components/layout/auth'
import SEO from '@/components/seo'
import SignUpForm from '@/components/signup-form'
import { useUnauthenticatedPage } from '@/hooks/auth'

function SignUp() {
  const router = useRouter()

  useUnauthenticatedPage()

  return (
    <React.Fragment>
      <SEO title="Sign Up" />
      <div>
        <h2 className="mt-6 text-3xl font-extrabold leading-9 text-gray-900">
          Sign up for an account
        </h2>
        <p className="max-w mt-2 text-sm leading-5 text-gray-600">
          Already have an account?{' '}
          <Link
            href={{
              pathname: '/signin',
              query: {
                ...(router.query.return_url && {
                  return_url: router.query.return_url
                })
              }
            }}
            className="font-medium text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500 focus:underline focus:outline-none"
          >
            Sign in
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
