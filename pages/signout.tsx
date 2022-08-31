import type { NextPage } from 'next'

import * as React from 'react'
import { useRouter } from 'next/router'

import { SpinnerSVG } from '@/components/icons'
import { useAuthDispatch } from '@/context/auth'

const SignOutPage: NextPage = () => {
  const { signOut } = useAuthDispatch()
  const router = useRouter()

  React.useEffect(() => {
    signOut()

    router.replace('/')
  }, [signOut])

  return (
    <div className="mt-8 flex justify-center">
      <SpinnerSVG className="h-6 w-6 animate-spin" />
    </div>
  )
}

export default SignOutPage
