import * as React from 'react'
import { useRouter } from 'next/router'

import { getLayout as getAuthLayout } from '@/components/layout/auth'
import ResetForm from '@/components/reset-form'
import SEO from '@/components/seo'
import { SpinnerSVG } from '@/icons'
import { useAuthDispatch } from '@/context/auth'
import { useUnauthenticatedPage } from '@/hooks/auth'

function ResetPassword() {
  const { verifyPasswordResetCode } = useAuthDispatch()
  const router = useRouter()
  const [verifyingCode, setVerifyingCode] = React.useState(true)

  useUnauthenticatedPage()

  React.useEffect(() => {
    if (!router.query.oobCode) router.push('/forgot')
  }, [router])

  React.useEffect(() => {
    const verifyCode = async (code) => {
      try {
        await verifyPasswordResetCode(code)
        setVerifyingCode(false)
      } catch (error) {
        router.push('/forgot')
      }
    }

    if (router.query.oobCode) verifyCode(router.query.oobCode)
  }, [router])

  return (
    <React.Fragment>
      <SEO title="Reset Password" />
      <div>
        <h2 className="mt-6 text-3xl font-extrabold leading-9 text-gray-900">
          Update your password
        </h2>
        <p className="max-w mt-2 text-sm leading-5 text-gray-600">
          Secure your account with a new password
        </p>
      </div>
      <div className="mt-8">
        {verifyingCode ? (
          <SpinnerSVG className="h-6 w-6 animate-spin" />
        ) : (
          <ResetForm />
        )}
      </div>
    </React.Fragment>
  )
}

ResetPassword.getLayout = getAuthLayout

export default ResetPassword
