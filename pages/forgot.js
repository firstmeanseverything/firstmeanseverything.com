import * as React from 'react'

import ForgotForm from '@/components/forgot-form'
import { getLayout as getAuthLayout } from '@/components/layout/auth'
import SEO from '@/components/seo'
import { useUnauthenticatedPage } from '@/hooks/auth'

function ForgotPassword() {
  useUnauthenticatedPage()

  return (
    <React.Fragment>
      <SEO title="Forgot Password" />
      <div>
        <h2 className="mt-6 text-3xl leading-9 font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-sm leading-5 text-gray-600 max-w">
          Forgot your password? Enter your email address and we'll send you a
          link to reset your password
        </p>
      </div>
      <div className="mt-8">
        <ForgotForm />
      </div>
    </React.Fragment>
  )
}

ForgotPassword.getLayout = getAuthLayout

export default ForgotPassword
