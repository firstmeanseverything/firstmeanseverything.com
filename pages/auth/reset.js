import * as React from 'react'
import { useRouter } from 'next/router'

import { getLayout as getAuthLayout } from 'components/layout/auth'
import ResetForm from 'components/reset-form'
import { SpinnerSVG } from 'svgs/icons'
import { useAuthDispatch, useAuthState } from 'context/auth'

function ResetPassword() {
  const { verifyPasswordResetCode } = useAuthDispatch()
  const { isAuthenticating, user } = useAuthState()
  const router = useRouter()
  const [verifyingCode, setVerifyingCode] = React.useState(true)

  React.useEffect(() => {
    if (!isAuthenticating && user) router.push('/')
  }, [isAuthenticating, user])

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
      <div>
        <h2 className="mt-6 text-3xl leading-9 font-extrabold text-gray-900">
          Update your password
        </h2>
        <p className="mt-2 text-sm leading-5 text-gray-600 max-w">
          Secure your account with a new password
        </p>
      </div>
      <div className="mt-8">
        {verifyingCode ? (
          <SpinnerSVG className="animate-spin h-6 w-6" />
        ) : (
          <ResetForm />
        )}
      </div>
    </React.Fragment>
  )
}

ResetPassword.getLayout = getAuthLayout

export default ResetPassword
